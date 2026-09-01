import { useQuery } from "@tanstack/react-query";
import { BloggerPost } from "./useBloggerPosts";

type BloggerPostDetail = BloggerPost & { contentHtml: string };

export const useBloggerPost = (slug: string | undefined) => {
  const { data, isLoading, error } = useQuery<BloggerPostDetail>({
    queryKey: ["blogPost", slug],
    queryFn: () =>
      fetch(`/blog-data/posts/${slug}.json`).then((r) => {
        if (!r.ok) throw new Error("Post not found.");
        return r.json();
      }),
    enabled: !!slug,
    staleTime: 1000 * 60 * 60,
  });

  return {
    post: data ?? null,
    loading: isLoading,
    error: error
      ? (error as Error).message || "Unable to load this post right now."
      : null,
  };
};

export type { BloggerPostDetail };
