
export function getDescription(html, maxLength = 160) {
  if (!html) return "";

  const doc = new DOMParser().parseFromString(html, "text/html");


  const candidates = doc.querySelectorAll("p, li, h2, h3");

  let text = "";
  for (const el of candidates) {
    const t = el.textContent.replace(/\s+/g, " ").trim();
    if (t.length > 20) {
      text = t;
      break;
    }
  }

  if (!text) {
    text = doc.body.textContent.replace(/\s+/g, " ").trim();
  }

  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  return cut.slice(0, cut.lastIndexOf(" ")).trim() + "…";
}


export function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}


export function getFirstImage(html) {
  if (!html) return null;
  const doc = new DOMParser().parseFromString(html, "text/html");
  const img = doc.querySelector("img");
  return img ? img.src : null;
}
