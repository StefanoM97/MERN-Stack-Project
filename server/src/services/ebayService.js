import axios from "axios";
import { env } from "../config/env.js";

let cachedToken = { value: "", expiresAt: 0 };

async function getAccessToken() {
  if (!env.ebay.clientId || !env.ebay.clientSecret) {
    const error = new Error("eBay API is not configured");
    error.status = 503;
    throw error;
  }

  if (cachedToken.value && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.value;
  }

  const basic = Buffer.from(`${env.ebay.clientId}:${env.ebay.clientSecret}`).toString("base64");
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    scope: "https://api.ebay.com/oauth/api_scope"
  });

  const { data } = await axios.post(
    "https://api.ebay.com/identity/v1/oauth2/token",
    body.toString(),
    {
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      timeout: 12_000
    }
  );

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + Number(data.expires_in || 7200) * 1000
  };
  return cachedToken.value;
}

export async function searchEbay(keyword, limit = 10) {
  const token = await getAccessToken();
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 20);

  const { data } = await axios.get(
    "https://api.ebay.com/buy/browse/v1/item_summary/search",
    {
      params: { q: keyword, limit: safeLimit },
      headers: {
        Authorization: `Bearer ${token}`,
        "X-EBAY-C-MARKETPLACE-ID": env.ebay.marketplaceId
      },
      timeout: 12_000
    }
  );

  const results = (data.itemSummaries || [])
    .map((item) => ({
      title: item.title || "",
      price: Number(item.price?.value),
      currency: item.price?.currency || "USD",
      condition: item.condition || "",
      imageUrl: item.image?.imageUrl || "",
      itemUrl: item.itemWebUrl || ""
    }))
    .filter((item) => Number.isFinite(item.price));

  const prices = results.map((result) => result.price).sort((a, b) => a - b);
  const average = prices.length
    ? prices.reduce((sum, price) => sum + price, 0) / prices.length
    : null;

  return {
    totalListings: Number(data.total || results.length),
    sampleSize: results.length,
    averagePrice: average == null ? null : Number(average.toFixed(2)),
    lowPrice: prices[0] ?? null,
    highPrice: prices.at(-1) ?? null,
    currency: results[0]?.currency || "USD",
    results
  };
}
