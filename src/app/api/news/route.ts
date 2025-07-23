import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // get params
  const type = searchParams.get("type") || "everything";

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
    const response = await axios.get(endpoint, { params });

    return NextResponse.json({
      success: true,
      message: "News data fetched successfully",
      data: response.data.articles,
      totalResults: response.data.totalResults
    });
  } catch (error: any) {
    console.error("NewsAPI error:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch news data",
        error: error.response?.data || error.message
      },
      { status: error.response.status || 500 }
    );
  }
}
