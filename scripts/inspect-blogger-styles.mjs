#!/usr/bin/env node
/**
 * Uses Chromium (via Playwright) to:
 * 1. Extract computed CSS from the live Blogger post
 * 2. Take a screenshot of the live post
 * 3. Take a screenshot of the migrated local post
 * 4. Print a CSS diff report
 *
 * Usage: node scripts/inspect-blogger-styles.mjs
 */

import { chromium } from "playwright";

const BLOGGER_URL =
  "https://advicelab.blogspot.com/2025/07/why-time-zone-alignment-matters-in.html";
const LOCAL_URL =
  "http://localhost:8080/blog/2123954529272474164";
const SCREENSHOTS_DIR = "./scripts";

async function extractPostStyles(page, selector) {
  return page.evaluate((sel) => {
    const container = document.querySelector(sel);
    if (!container) return null;

    const getComputed = (el) => {
      const s = window.getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        fontFamily: s.fontFamily,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        lineHeight: s.lineHeight,
        color: s.color,
        marginTop: s.marginTop,
        marginBottom: s.marginBottom,
        paddingTop: s.paddingTop,
        paddingBottom: s.paddingBottom,
        letterSpacing: s.letterSpacing,
        textAlign: s.textAlign,
      };
    };

    const results = {};

    // Sample key elements
    const selectors = {
      body: "p",
      h2: "h2",
      h3: "h3",
      li: "li",
      strong: "strong",
      a: "a",
    };

    for (const [name, tag] of Object.entries(selectors)) {
      const el = container.querySelector(tag);
      if (el) results[name] = getComputed(el);
    }

    // Also get the container itself
    results.container = getComputed(container);

    // Get inner HTML structure (first 3000 chars)
    results._html = container.innerHTML.slice(0, 3000);
    results._containerClass = container.className;
    results._containerTag = container.tagName.toLowerCase();

    return results;
  }, selector);
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  // ─── Live Blogger ──────────────────────────────────────────────
  console.log("Opening live Blogger post...");
  const bloggerPage = await browser.newPage();
  await bloggerPage.setViewportSize({ width: 1280, height: 900 });
  await bloggerPage.goto(BLOGGER_URL, { waitUntil: "networkidle", timeout: 30000 });

  // Try common Blogger content selectors
  const bloggerSelectors = [
    ".post-body",
    ".entry-content",
    "article",
    ".post",
    '[itemprop="articleBody"]',
    ".post-content",
  ];

  let bloggerStyles = null;
  let usedSelector = null;
  for (const sel of bloggerSelectors) {
    bloggerStyles = await extractPostStyles(bloggerPage, sel);
    if (bloggerStyles) { usedSelector = sel; break; }
  }

  // Fallback: find all divs/sections with substantial text
  if (!bloggerStyles) {
    usedSelector = await bloggerPage.evaluate(() => {
      const els = document.querySelectorAll("div, section, main");
      let best = null, bestLen = 0;
      for (const el of els) {
        const text = el.innerText?.length ?? 0;
        if (text > bestLen && text < 10000) { bestLen = text; best = el; }
      }
      if (best) {
        best.setAttribute("data-inspect", "1");
        return "[data-inspect='1']";
      }
      return null;
    });
    if (usedSelector) {
      bloggerStyles = await extractPostStyles(bloggerPage, usedSelector);
    }
  }

  console.log(`Blogger content selector: ${usedSelector}`);
  await bloggerPage.screenshot({
    path: `${SCREENSHOTS_DIR}/blogger-live.png`,
    fullPage: false,
  });
  console.log("Screenshot saved: scripts/blogger-live.png");

  // ─── Local migrated site ────────────────────────────────────────
  console.log("\nOpening local migrated post...");
  const localPage = await browser.newPage();
  await localPage.setViewportSize({ width: 1280, height: 900 });
  try {
    await localPage.goto(LOCAL_URL, { waitUntil: "networkidle", timeout: 15000 });
    const localStyles = await extractPostStyles(localPage, ".prose");
    await localPage.screenshot({
      path: `${SCREENSHOTS_DIR}/local-migrated.png`,
      fullPage: false,
    });
    console.log("Screenshot saved: scripts/local-migrated.png");

    // ─── Print comparison ──────────────────────────────────────────
    console.log("\n\n═══════════════════════════════════════════════");
    console.log("  COMPUTED CSS COMPARISON");
    console.log("═══════════════════════════════════════════════\n");

    const elements = ["container", "body", "h2", "h3", "li", "strong", "a"];
    for (const el of elements) {
      const live = bloggerStyles?.[el];
      const local = localStyles?.[el];
      if (!live && !local) continue;
      console.log(`── <${el}> ──────────────────────────────────`);
      const props = ["fontFamily", "fontSize", "fontWeight", "lineHeight", "color", "marginTop", "marginBottom", "letterSpacing"];
      for (const prop of props) {
        const lv = live?.[prop] ?? "—";
        const lc = local?.[prop] ?? "—";
        const diff = lv !== lc ? " ◄ DIFF" : "";
        if (diff || (lv !== "—" && lv !== "normal" && lv !== "0px")) {
          console.log(`  ${prop.padEnd(16)} Blogger: ${lv.padEnd(40)} Local: ${lc}${diff}`);
        }
      }
    }

    console.log("\n\n═══════════════════════════════════════════════");
    console.log("  BLOGGER CONTENT HTML (first 2000 chars)");
    console.log("═══════════════════════════════════════════════");
    console.log(bloggerStyles?._html?.slice(0, 2000) ?? "not found");

  } catch (e) {
    console.error("Could not reach local server:", e.message);
    console.log("Make sure 'npm run dev' is running on port 8080");
  }

  await browser.close();
  console.log("\nDone. Open scripts/blogger-live.png and scripts/local-migrated.png to compare.");
}

main().catch((e) => { console.error(e); process.exit(1); });
