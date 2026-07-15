import axios from "axios";
import { env } from "../config/env.js";

export async function searchYouTube(keyword, limit = 5) {
  if (!env.youtubeApiKey) {
    const error = new Error("YouTube API is not configured");
    error.status = 503;
    throw error;
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 5, 1), 10);
  const searchResponse = await axios.get("https://www.googleapis.com/youtube/v3/search", {
    params: {
      key: env.youtubeApiKey,
      part: "snippet",
      q: keyword,
      type: "video",
      maxResults: safeLimit,
      order: "relevance"
    },
    timeout: 12_000
  });

  const items = searchResponse.data.items || [];
  const ids = items.map((item) => item.id?.videoId).filter(Boolean);
  let statisticsById = new Map();

  if (ids.length) {
    const statsResponse = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
      params: {
        key: env.youtubeApiKey,
        part: "statistics",
        id: ids.join(",")
      },
      timeout: 12_000
    });
    statisticsById = new Map(
      (statsResponse.data.items || []).map((item) => [item.id, item.statistics || {}])
    );
  }

  const videos = items.map((item) => {
    const id = item.id.videoId;
    const statistics = statisticsById.get(id) || {};
    return {
      title: item.snippet?.title || "",
      channelTitle: item.snippet?.channelTitle || "",
      publishedAt: item.snippet?.publishedAt,
      viewCount: Number(statistics.viewCount || 0),
      videoUrl: `https://www.youtube.com/watch?v=${id}`
    };
  });

  return {
    resultCount: Number(searchResponse.data.pageInfo?.totalResults || videos.length),
    sampledVideoCount: videos.length,
    totalViews: videos.reduce((sum, video) => sum + video.viewCount, 0),
    videos
  };
}
