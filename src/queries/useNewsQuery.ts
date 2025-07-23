import { useQuery } from "@tanstack/react-query";
import { ArticleTypes, ArticleParams } from "@/types/news";

interface NewsResponse {
  success: boolean;
  message: string;
  data: ArticleTypes[];
  totalResults: number;
}

export const useNewsQuery = (params?: ArticleParams) => {
  const defaultParams: ArticleParams = { type: "everything" };
  const finalParams = { ...defaultParams, ...params };

  const queryParams = new URLSearchParams(
    finalParams as Record<string, string>
  ).toString();

  return useQuery<NewsResponse>({
    queryKey: ["news", queryParams],

    queryFn: async () => {
      const res = await fetch(`/api/news?${queryParams}`);

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      return res.json();
    },

    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  });
};
