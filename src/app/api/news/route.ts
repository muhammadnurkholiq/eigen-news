import { NewsAPIResponse } from "@/types/news";
import axios, { isAxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // get params
  const type = searchParams.get("type") || "everything";

  if (type !== "everything" && type !== "top-headlines") {
    return NextResponse.json(
      { success: false, message: "Invalid type parameter." },
      { status: 400 }
    );
  }

  const endpoint =
    type === "top-headlines"
      ? "https://newsapi.org/v2/top-headlines"
      : "https://newsapi.org/v2/everything";

  const params: Record<string, string> = {};

  // check api key
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        message: "API key tidak tersedia"
      },
      { status: 500 }
    );
  }

  // config allow params
  const allowedParams = [
    "q",
    "searchIn",
    "sources",
    "domains",
    "excludeDomains",
    "from",
    "to",
    "language",
    "sortBy",
    "pageSize",
    "page",
    "country",
    "category"
  ];

  // check allowed params
  allowedParams.forEach((key) => {
    const value = searchParams.get(key);
    if (value) {
      params[key] = value;
    }
  });

  // insert api key
  params["apiKey"] = apiKey;

  try {
    const response = await axios.get<NewsAPIResponse>(endpoint, {
      params,
      headers: { "Cache-Control": "s-maxage=600, stale-while-revalidate=300" }
    });

    return NextResponse.json(
      {
        success: true,
        message: "News data fetched successfully",
        data: response.data.articles,
        totalResults: response.data.totalResults
      },
      {
        status: 200,
        headers: { "Cache-Control": "public, max-age=300" }
      }
    );
  } catch (error: unknown) {
    let message = "Unknown error occurred";
    let status = 500;
    let responseError: unknown = null;

    if (isAxiosError(error)) {
      console.error("AxiosError", {
        url: endpoint,
        params,
        status: error.response?.status,
        data: error.response?.data
      });

      message = error.message;
      status = error.response?.status ?? 500;
      responseError = error.response?.data;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch news data",
        error: responseError ?? message
      },
      { status }
    );
  }
}
