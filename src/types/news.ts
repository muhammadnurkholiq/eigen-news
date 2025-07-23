export interface ArticleTypes {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface ArticleParams {
  type?: "everything" | "top-headlines";
  q?: string;
  searchIn?: string;
  sources?: string;
  domains?: string;
  excludeDomains?: string;
  from?: string;
  to?: string;
  language?: string;
  sortBy?: string;
  pageSize?: string;
  page?: string;
  country?: string;
  category?: string;
}

export interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: ArticleTypes[];
}
