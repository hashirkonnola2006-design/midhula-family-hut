import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface VideoItem {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  duration: string;
  views: string;
  thumbnail: string;
}

interface ChannelInfo {
  name: string;
  avatar: string;
  url: string;
  subscribers: string;
  videoCount?: string;
}

function parseDuration(isoDuration: string): string {
  if (!isoDuration) return "";
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return isoDuration;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);

  const secStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
  if (hours > 0) {
    const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hours}:${minStr}:${secStr}`;
  }
  return `${minutes}:${secStr}`;
}

function formatViews(views: string | number): string {
  const num = typeof views === "string" ? parseInt(views, 10) : views;
  if (isNaN(num)) return typeof views === "string" ? views : "";
  if (num >= 1000000) return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M views`;
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K views`;
  return `${num} views`;
}

function formatRelativeDate(isoDate: string): string {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return isoDate;
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 4) return `${diffWeek} week${diffWeek > 1 ? "s" : ""} ago`;
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth} month${diffMonth > 1 ? "s" : ""} ago`;
  const diffYear = Math.floor(diffDay / 365);
  return `${diffYear} year${diffYear > 1 ? "s" : ""} ago`;
}

function getFallbackData(): { channel: ChannelInfo; videos: VideoItem[] } {
  try {
    const filePath = path.join(process.cwd(), "data", "videos.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      return {
        channel: parsed.channel || {
          name: "Midhula Farm Hut",
          avatar: "/clay/logo/logo.webp",
          url: "https://www.youtube.com/@Midhula_Farm_Hut",
          subscribers: "90K+ subscribers",
        },
        videos: parsed.videos || [],
      };
    }
  } catch (err) {
    console.error("Error reading fallback videos.json:", err);
  }

  return {
    channel: {
      name: "Midhula Farm Hut",
      avatar: "https://yt3.googleusercontent.com/9U44x8cT71pXfzOQ3vmR_NxraZuVry1wW0b-MkPcCct-ygkLl-xHcK99J9HA85NKdXiqyKRM=s160-c-k-c0x00ffffff-no-rj",
      url: "https://www.youtube.com/@Midhula_Farm_Hut",
      subscribers: "91.4K subscribers",
    },
    videos: [],
  };
}

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    // Graceful fallback to static data
    const fallback = getFallbackData();
    return NextResponse.json(fallback, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  }

  try {
    // 1. Fetch channel info by handle
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet,statistics&forHandle=Midhula_Farm_Hut&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );

    if (!channelRes.ok) {
      console.warn("YouTube channel fetch returned non-200:", channelRes.status);
      return NextResponse.json(getFallbackData(), {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }

    const channelData = await channelRes.json();
    const item = channelData.items?.[0];

    if (!item) {
      console.warn("No channel found for handle Midhula_Farm_Hut");
      return NextResponse.json(getFallbackData(), {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }

    const uploadsPlaylistId = item.contentDetails?.relatedPlaylists?.uploads;
    const subCount = item.statistics?.subscriberCount;
    const formattedSubs = subCount
      ? `${formatViews(subCount).replace(" views", "")} subscribers`
      : "90K+ subscribers";

    const channel: ChannelInfo = {
      name: item.snippet?.title || "Midhula Farm Hut",
      avatar:
        item.snippet?.thumbnails?.medium?.url ||
        item.snippet?.thumbnails?.default?.url ||
        "https://yt3.googleusercontent.com/9U44x8cT71pXfzOQ3vmR_NxraZuVry1wW0b-MkPcCct-ygkLl-xHcK99J9HA85NKdXiqyKRM=s160-c-k-c0x00ffffff-no-rj",
      url: "https://www.youtube.com/@Midhula_Farm_Hut",
      subscribers: formattedSubs,
      videoCount: item.statistics?.videoCount ? `${item.statistics.videoCount} videos` : undefined,
    };

    if (!uploadsPlaylistId) {
      return NextResponse.json({ channel, videos: getFallbackData().videos }, {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }

    // 2. Fetch playlist items (videos)
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=24&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );

    if (!playlistRes.ok) {
      return NextResponse.json({ channel, videos: getFallbackData().videos }, {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }

    const playlistData = await playlistRes.json();
    const playlistItems = playlistData.items || [];

    // Filter out private/deleted videos
    const validItems = playlistItems.filter(
      (pi: any) =>
        pi.snippet?.title !== "Private video" &&
        pi.snippet?.title !== "Deleted video" &&
        pi.contentDetails?.videoId
    );

    const videoIds = validItems.map((pi: any) => pi.contentDetails.videoId);

    // 3. Fetch video details (duration & statistics)
    let statsMap: Record<string, { duration: string; views: string }> = {};

    if (videoIds.length > 0) {
      const videosRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds.join(",")}&key=${apiKey}`,
        { next: { revalidate: 3600 } }
      );

      if (videosRes.ok) {
        const videosData = await videosRes.json();
        for (const v of videosData.items || []) {
          statsMap[v.id] = {
            duration: parseDuration(v.contentDetails?.duration),
            views: formatViews(v.statistics?.viewCount || 0),
          };
        }
      }
    }

    const videos: VideoItem[] = validItems.map((pi: any) => {
      const vidId = pi.contentDetails.videoId;
      const stats = statsMap[vidId];
      const thumbs = pi.snippet?.thumbnails;
      const thumb =
        thumbs?.maxres?.url ||
        thumbs?.high?.url ||
        thumbs?.medium?.url ||
        `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`;

      return {
        id: vidId,
        title: pi.snippet?.title || "",
        description: pi.snippet?.description || "",
        publishedAt: formatRelativeDate(pi.snippet?.publishedAt),
        duration: stats?.duration || "10:00",
        views: stats?.views || "1K views",
        thumbnail: thumb,
      };
    });

    return NextResponse.json(
      { channel, videos },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("YouTube API error:", error);
    return NextResponse.json(getFallbackData(), {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  }
}
