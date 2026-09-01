#!/usr/bin/env node
/**
 * Export all posts from Google Blogger to static JSON + local images.
 *
 * Output:
 *   public/blog-data/posts.json          — post index (no contentHtml)
 *   public/blog-data/posts/{postId}.json — full post per file
 *   public/blog-data/images/{hash}.ext   — downloaded images
 *
 * Usage: node scripts/export-blogger.mjs
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "blog-data");
const POSTS_DIR = path.join(OUT_DIR, "posts");
const IMAGES_DIR = path.join(OUT_DIR, "images");

const BLOGGER_FEED =
  "https://advicelab.blogspot.com/feeds/posts/default?alt=json&max-results=500";

const BLOGGER_DOMAINS = [
  "lh3.googleusercontent.com",
  "lh4.googleusercontent.com",
  "lh5.googleusercontent.com",
  "lh6.googleusercontent.com",
  "1.bp.blogspot.com",
  "2.bp.blogspot.com",
  "3.bp.blogspot.com",
  "4.bp.blogspot.com",
  "blogger.googleusercontent.com",
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(str, len) {
  return str.length > len ? str.slice(0, len).trimEnd() + "..." : str;
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function upgradeImageQuality(url) {
  if (!url) return url;
  return url
    .replace(/\/s72(-c)?/i, "/s1600")
    .replace(/\/w72-h72(-c)?/i, "/w1200-h800")
    .replace(/\/s320(-c)?/i, "/s1600")
    .replace(/\/w320-h[^/]+/i, "/w1200-h800");
}

function removeScripts(html) {
  return html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
}

// Strip all inline styles from block-level elements — Tailwind prose handles
// spacing, font-size, and margins for these. Blogger injects CSS resets
// (margin:0px, padding, box-sizing, font-feature-settings, etc.) that override prose.
function stripBlockInlineStyles(html) {
  return html.replace(
    /<(p|h[1-6]|ul|ol|li|blockquote)((\s[^>]*)?)>/gi,
    (_, tag, attrs) => {
      const cleaned = (attrs || "").replace(/\s*style="[^"]*"/gi, "").trim();
      return `<${tag}${cleaned ? " " + cleaned : ""}>`;
    }
  );
}

// CSS properties to strip from ALL inline styles.
// Keep: text-align, clear, float, color — intentional visual properties.
// Strip everything else that Blogger/Word injects as resets or theme overrides.
const STRIP_PROPS = [
  "margin", "margin-top", "margin-right", "margin-bottom", "margin-left",
  "padding", "padding-top", "padding-right", "padding-bottom", "padding-left",
  "font-family", "font-size", "font-stretch", "font-variant", "font-weight",
  "font-style", "font-kerning", "font-language-override", "font-optical-sizing",
  "font-size-adjust", "font-variation-settings", "font-feature-settings",
  "line-height", "letter-spacing",
  "background-color", "background",
  "border", "border-top", "border-right", "border-bottom", "border-left",
  "box-sizing", "box-shadow",
  "vertical-align",
  "position", "overflow", "overflow-wrap", "overflow-x", "overflow-y",
  "cursor", "user-select", "-webkit-user-select", "-webkit-user-drag",
  "-webkit-tap-highlight-color", "-webkit-font-smoothing",
];

const STRIP_PROPS_RE = new RegExp(
  `(${STRIP_PROPS.map(p => p.replace(/-/g, "\\-")).join("|")})\\s*:[^;}"]+;?\\s*`,
  "gi"
);

function stripInlineSpacingAndFonts(html) {
  return html.replace(/style="([^"]*)"/gi, (_, styles) => {
    const cleaned = styles.replace(STRIP_PROPS_RE, "").trim().replace(/;+$/, "");
    return cleaned ? `style="${cleaned}"` : "";
  });
}

// Detect bold standalone spans that Blogger renders as section headings and
// promote them to <h2>. Must run BEFORE style stripping (needs font-weight).
// Rule: <p><span style="...font-weight: 600+...">text</span></p>
//   where the span is the sole content, and text is NOT a sentence fragment
//   (sentence fragments have a comma AND end with terminal punctuation).
function promoteHeadings(html) {
  return html.replace(
    /<p[^>]*>\s*<span([^>]*)>([^<]+)<\/span>\s*<\/p>/gi,
    (match, spanAttrs, rawText) => {
      const text = rawText.trim();
      if (!text) return match;

      // Must have font-weight ≥ 600 or bold
      const fw = (spanAttrs.match(/font-weight\s*:\s*([^;}"]+)/i)?.[1] ?? "").trim();
      const isBold = /^(bold|[6-9]\d\d|1000)$/i.test(fw);
      if (!isBold) return match;

      // Exclude sentence fragments: have a comma AND end with terminal punctuation
      const endsWithPunct = /[.!?]$/.test(text);
      const hasComma = text.includes(",");
      if (endsWithPunct && hasComma) return match;

      return `<h2>${text}</h2>`;
    }
  );
}

// Promote inline sub-headings of the form:
//   <p>ShortTitle<br />Description text...</p>
// into: <h3>ShortTitle</h3><p>Description text...</p>
// Must run AFTER unwrapBareSpans (so spans are already unwrapped).
function promoteInlineSubheadings(html) {
  return html.replace(
    /<p>([^<]{1,60}?)<br\s*\/?>([\s\S]*?)<\/p>/gi,
    (match, title, body) => {
      const t = title.trim();
      const b = body.trim();
      if (!t || !b) return match;
      // Title must be concise (no comma, no period, not starting with emoji sequences that are section markers already promoted)
      if (t.includes(",") || /[.!?]$/.test(t)) return match;
      // Don't double-promote — skip if title already looks like it has HTML tags
      if (/</.test(t)) return match;
      return `<h3>${t}</h3><p>${b}</p>`;
    }
  );
}

// Strip width="" and height="" HTML attributes from <img> tags so CSS controls sizing.
// For images inside Blogger's .separator centering div, cap display size so they
// don't stretch to full container width (they're square illustration thumbnails).
function stripImgDimensions(html) {
  // Mark images inside Blogger's .separator centering divs with a sentinel class
  // so CSS can constrain their size (they're square illustration thumbnails).
  // Strategy: find each .separator block, locate the img inside, tag it.
  let withSeparatorCapped = html;
  withSeparatorCapped = withSeparatorCapped.replace(
    /(<div\b[^>]*class="separator"[^>]*>)([\s\S]*?)(<\/div>)/gi,
    (match, open, inner, close) => {
      const taggedInner = inner.replace(
        /<img\b([^>]*?)\s*\/?>/i,
        (imgMatch, imgAttrs) => {
          // Don't double-tag
          if (imgAttrs.includes("separator-img")) return imgMatch;
          const cleaned = imgAttrs
            .replace(/\s+width="[^"]*"/gi, "")
            .replace(/\s+height="[^"]*"/gi, "")
            .replace(/\s+style="[^"]*"/gi, "")
            .trim();
          return `<img ${cleaned} class="separator-img" />`;
        }
      );
      return `${open}${taggedInner}${close}`;
    }
  );
  // Then strip width/height from all remaining images
  return withSeparatorCapped.replace(/<img([^>]*)>/gi, (_, attrs) => {
    const cleaned = attrs
      .replace(/\s+width="[^"]*"/gi, "")
      .replace(/\s+height="[^"]*"/gi, "");
    return `<img${cleaned}>`;
  });
}

// Unwrap bare <span> tags (no class, no id, no data-*) left after style stripping.
// Runs after stripInlineSpacingAndFonts removes the style attribute.
function unwrapBareSpans(html) {
  // Repeat until no more bare spans (handles nesting like <span ><span >text</span></span>)
  let prev;
  let result = html;
  do {
    prev = result;
    result = result.replace(/<span\s*>([^<]*)<\/span>/gi, "$1");
  } while (result !== prev);
  return result;
}

// Strip all attributes from <br> tags and remove <p><br /></p> empty paragraphs.
function cleanBrElements(html) {
  return html
    .replace(/<br[^>]*\/>/gi, "<br />")
    .replace(/<br[^>]*>/gi, "<br />")
    .replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, "")
    .replace(/<li[^>]*>\s*<br\s*\/?>\s*<\/li>/gi, "");
}

// Remove Microsoft Office / Word Online artifacts left behind when content
// was authored in Word and pasted into Blogger.
function stripOfficeArtifacts(html) {
  return html
    // Office namespace tags: <o:p>, <o:p></o:p>, </o:p>
    .replace(/<\/?o:[a-z]+[^>]*>/gi, "")
    // Word Online container classes (SCXW, BCX, OutlineElement, Paragraph)
    .replace(/\s*class="[^"]*(?:SCXW|BCX|OutlineElement|MsoNormal|MsoListParagraph|Paragraph)[^"]*"/gi, "")
    // Word XML attributes: paraeid, paraid, role="heading" on non-heading tags
    .replace(/\s*(?:paraeid|paraid)="[^"]*"/gi, "")
    // Empty paragraphs (blank lines that add unwanted spacing)
    .replace(/<p[^>]*>\s*(&nbsp;)?\s*<\/p>/gi, "")
    // Empty list items (blank lines inside a Word-pasted <ul>/<ol> that render as stray bullets)
    .replace(/<li[^>]*>\s*(&nbsp;)?\s*<\/li>/gi, "")
    // Word user-select / tap-highlight divs that add no content
    .replace(/<div[^>]*style="[^"]*-webkit-user-drag[^"]*"[^>]*>([\s\S]*?)<\/div>/gi, "$1");
}

function extractPostId(entry) {
  const rawId = entry?.id?.$t ?? "";
  const fromId = rawId.match(/post-([0-9]+)/)?.[1];
  if (fromId) return fromId;
  const altLink = entry?.link?.find((l) => l.rel === "alternate")?.href ?? "";
  return altLink.split("/").pop() ?? "";
}

function sha1(str) {
  return crypto.createHash("sha1").update(str).digest("hex");
}

function extFromUrl(url) {
  try {
    const p = new URL(url).pathname;
    const m = p.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i);
    return m ? `.${m[1].toLowerCase()}` : ".jpg";
  } catch {
    return ".jpg";
  }
}

function isBloggerImage(url) {
  if (!url) return false;
  try {
    return BLOGGER_DOMAINS.some((d) => new URL(url).hostname === d);
  } catch {
    return false;
  }
}

function extractImgSrcs(html) {
  const urls = [];
  const re = /<img[^>]+src=["']([^"']+)["'][^>]*/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    urls.push(m[1]);
  }
  return urls;
}

// Returns first image URL found in content HTML (preferred thumbnail source)
function extractFirstImageFromContent(html) {
  const m = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*/i);
  return m?.[1] ?? null;
}

function rewriteUrls(html, urlMap) {
  let result = html;
  for (const [orig, local] of Object.entries(urlMap)) {
    result = result.split(orig).join(local);
  }
  return result;
}

function rewriteBloggerPostLinks(html, postIdMap) {
  // Replace links like https://advicelab.blogspot.com/2024/01/post-slug.html
  // with internal React route /blog/{postId}
  return html.replace(
    /href=["'](https?:\/\/advicelab\.blogspot\.com\/[^"']+)["']/gi,
    (match, href) => {
      const slug = href.split("/").pop()?.replace(/\.html?$/, "") ?? "";
      const postId = postIdMap[slug];
      if (postId) return `href="/blog/${postId}"`;
      return match; // leave unchanged if we can't resolve it
    }
  );
}

// ─── fetch all posts ───────────────────────────────────────────────────────────

async function fetchAllEntries() {
  const entries = [];
  let url = BLOGGER_FEED;

  while (url) {
    console.log(`  Fetching: ${url}`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
    const data = await res.json();
    const feed = data.feed;
    const batch = feed.entry ?? [];
    entries.push(...batch);
    const nextLink = feed.link?.find((l) => l.rel === "next")?.href;
    url = nextLink ?? null;
  }

  return entries;
}

// ─── download image ────────────────────────────────────────────────────────────

async function downloadImage(imageUrl) {
  const hash = sha1(imageUrl);
  const ext = extFromUrl(imageUrl);
  const filename = `${hash}${ext}`;
  const localPath = path.join(IMAGES_DIR, filename);
  const webPath = `/blog-data/images/${filename}`;

  if (fs.existsSync(localPath)) {
    return webPath; // already downloaded
  }

  try {
    const res = await fetch(imageUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) {
      console.warn(`    ⚠ Could not download ${imageUrl} (${res.status})`);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(localPath, buf);
    return webPath;
  } catch (err) {
    console.warn(`    ⚠ Failed to download ${imageUrl}: ${err.message}`);
    return null;
  }
}

// ─── main ──────────────────────────────────────────────────────────────────────

async function main() {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  console.log("Fetching posts from Blogger...");
  const entries = await fetchAllEntries();
  console.log(`Found ${entries.length} posts.\n`);

  // Build a slug → postId map for rewriting inter-post links
  const postIdMap = {};
  for (const entry of entries) {
    const href =
      entry?.link?.find((l) => l.rel === "alternate")?.href ?? "";
    const slug = href.split("/").pop()?.replace(/\.html?$/, "") ?? "";
    const postId = extractPostId(entry);
    if (slug && postId) postIdMap[slug] = postId;
  }

  // Collect all unique image URLs across all posts.
  // We store { original, upgraded } pairs so the urlMap can resolve
  // both the raw HTML URL (original) and the pre-upgraded thumbnail URL.
  console.log("Collecting image URLs...");
  const imageQueue = new Map(); // upgraded URL → Set of original URLs that map to it
  for (const entry of entries) {
    const content = entry?.content?.$t || entry?.summary?.$t || "";
    const mediaThumb = entry?.media$thumbnail?.url;
    if (mediaThumb && isBloggerImage(mediaThumb)) {
      const upgraded = upgradeImageQuality(mediaThumb);
      if (!imageQueue.has(upgraded)) imageQueue.set(upgraded, new Set());
      imageQueue.get(upgraded).add(mediaThumb);
      if (upgraded !== mediaThumb) imageQueue.get(upgraded).add(upgraded);
    }
    for (const src of extractImgSrcs(content)) {
      if (!isBloggerImage(src)) continue;
      const upgraded = upgradeImageQuality(src);
      if (!imageQueue.has(upgraded)) imageQueue.set(upgraded, new Set());
      imageQueue.get(upgraded).add(src); // original URL as it appears in HTML
      if (upgraded !== src) imageQueue.get(upgraded).add(upgraded);
    }
  }
  console.log(`Found ${imageQueue.size} unique images to download.\n`);

  // Download all images and build urlMap keyed by EVERY alias (original + upgraded)
  console.log("Downloading images...");
  const urlMap = {};
  let imgCount = 0;
  for (const [upgradedUrl, aliases] of imageQueue) {
    const localPath = await downloadImage(upgradedUrl);
    if (localPath) {
      for (const alias of aliases) urlMap[alias] = localPath;
      imgCount++;
      if (imgCount % 10 === 0) process.stdout.write(`  ${imgCount}/${imageQueue.size}\r`);
    }
  }
  console.log(`\nDownloaded ${imgCount} of ${imageQueue.size} images.\n`);

  // Normalize and write each post
  console.log("Writing post JSON files...");
  const postIndex = [];

  for (const entry of entries) {
    const postId = extractPostId(entry);
    if (!postId) {
      console.warn("  ⚠ Skipping entry with no postId");
      continue;
    }

    const rawId = entry?.id?.$t ?? "";
    const altLink =
      entry?.link?.find((l) => l.rel === "alternate")?.href ?? "#";
    const publishedRaw =
      entry?.published?.$t || entry?.updated?.$t || "";
    const rawContent = entry?.content?.$t || entry?.summary?.$t || "";
    const mediaThumbRaw = entry?.media$thumbnail?.url;
    const categories =
      entry?.category?.map((c) => c?.term).filter(Boolean) ?? [];
    const author = entry?.author?.[0]?.name?.$t ?? "Advice Lab";

    // Rewrite image URLs in contentHtml
    let contentHtml = removeScripts(rawContent);
    contentHtml = promoteHeadings(contentHtml);         // before style strip — needs font-weight
    contentHtml = stripOfficeArtifacts(contentHtml);
    contentHtml = stripBlockInlineStyles(contentHtml);
    contentHtml = stripInlineSpacingAndFonts(contentHtml);
    contentHtml = stripImgDimensions(contentHtml);
    contentHtml = unwrapBareSpans(contentHtml);
    contentHtml = cleanBrElements(contentHtml);
    contentHtml = promoteInlineSubheadings(contentHtml); // after unwrapBareSpans
    contentHtml = rewriteUrls(contentHtml, urlMap);
    contentHtml = rewriteBloggerPostLinks(contentHtml, postIdMap);

    // Prefer first image from content (same as original hook), fall back to media thumbnail.
    // urlMap is keyed by both original and upgraded URLs so both lookups work.
    const contentImgSrc = extractFirstImageFromContent(rawContent);
    const contentThumb = contentImgSrc
      ? urlMap[contentImgSrc] ?? urlMap[upgradeImageQuality(contentImgSrc)] ?? null
      : null;
    const mediaThumb = mediaThumbRaw
      ? urlMap[mediaThumbRaw] ?? urlMap[upgradeImageQuality(mediaThumbRaw)] ?? null
      : null;
    const thumbnail = contentThumb ?? mediaThumb ?? null;

    const excerpt = truncate(stripHtml(rawContent), 180);

    const altSlug = altLink.split("/").pop()?.replace(/\.html?$/, "") ?? "";
    const slug = altSlug || postId;

    const post = {
      id: rawId || altLink,
      postId,
      slug,
      title: entry?.title?.$t || "Untitled post",
      url: altLink,
      published: formatDate(publishedRaw),
      publishedRaw,
      excerpt,
      category: categories[0] || "Blog",
      categories,
      author,
      thumbnail,
      contentHtml,
    };

    // Write individual post file by slug
    fs.writeFileSync(
      path.join(POSTS_DIR, `${slug}.json`),
      JSON.stringify(post, null, 2)
    );

    // Add summary (no contentHtml) to index
    const { contentHtml: _drop, ...summary } = post;
    postIndex.push(summary);
  }

  // Sort newest-first by publishedRaw
  postIndex.sort(
    (a, b) => new Date(b.publishedRaw).getTime() - new Date(a.publishedRaw).getTime()
  );

  fs.writeFileSync(
    path.join(OUT_DIR, "posts.json"),
    JSON.stringify(postIndex, null, 2)
  );

  console.log(`\n✓ Wrote ${postIndex.length} posts to public/blog-data/posts.json`);
  console.log(`✓ Wrote ${postIndex.length} individual post files to public/blog-data/posts/`);
  console.log(`✓ Downloaded ${imgCount} images to public/blog-data/images/`);
  console.log("\nDone. Run 'npm run dev' to validate locally.");
}

main().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
