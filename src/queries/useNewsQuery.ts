import { useQuery } from "@tanstack/react-query";
import { ArticleTypes, ArticleParams } from "@/types/news";

interface NewsResponse {
  success: boolean;
  message: string;
  data: ArticleTypes[];
}

export const useNewsQuery = (params?: ArticleParams) => {
  const queryParams = new URLSearchParams({
    ...(params || {}),
    type: params?.type || "everything"
  }).toString();

  return useQuery<NewsResponse>({
    queryKey: ["news", queryParams],

    queryFn: async () => {
      const res = await fetch(`/api/news?${queryParams}`);

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      return res.json();
    },

    refetchOnWindowFocus: false
  });
};
