import { useQuery } from "@tanstack/react-query";

type BloggerPost = {
  id: string;
  postId: string;
  slug: string;
  title: string;
  url: string;
  published: string;
  publishedRaw?: string;
  excerpt: string;
  category: string;
  categories?: string[];
  author?: string;
  thumbnail?: string;
};

export const useBloggerPosts = (limit = 24) => {
  const { data, isLoading, error } = useQuery<BloggerPost[]>({
    queryKey: ["blogPosts"],
    queryFn: () =>
      fetch("/blog-data/posts.json").then((r) => {
        if (!r.ok) throw new Error("Unable to load blog posts right now.");
        return r.json();
      }),
    staleTime: 1000 * 60 * 60, // 1 hour — static file, no need to refetch often
  });

  return {
    posts: (data ?? []).slice(0, limit),
    loading: isLoading,
    error: error ? "Unable to load blog posts right now." : null,
  };
};

export type { BloggerPost };
