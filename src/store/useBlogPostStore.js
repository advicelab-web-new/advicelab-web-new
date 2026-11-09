const API_KEY = import.meta.env.VITE_BLOGGER_API_KEY;
const BLOG_ID = import.meta.env.VITE_BLOG_ID;

const BASE_URL = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}`;

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body?.error?.message || res.statusText;
    throw new Error(`Blogger API error (${res.status}): ${message}`);
  }
  return res.json();
}

function getApiUrl(path, params = {}) {
  if (!API_KEY || !BLOG_ID) {
    throw new Error("Blogger API is not configured.");
  }

  const searchParams = new URLSearchParams({
    key: API_KEY,
    ...params,
  });

  return `${BASE_URL}${path}?${searchParams.toString()}`;
}

// Blogger returns posts a page at a time. Keep following nextPageToken
// until every post has been fetched.
export async function fetchPosts(pageSize = 50) {
  const posts = [];
  let pageToken;

  do {
    const url = getApiUrl("/posts", {
      fetchBodies: "true",
      maxResults: String(pageSize),
      ...(pageToken ? { pageToken } : {}),
    });
    const data = await handle(await fetch(url));
    posts.push(...(data.items || []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  return posts;
}


export async function fetchPostById(postId) {
  const url = getApiUrl(`/posts/${encodeURIComponent(postId)}`);
  return handle(await fetch(url));
}
