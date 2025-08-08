import { useState, useEffect } from "react";
import axios from "axios";

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export interface YoutubeVideo {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  channel: string;
}

export function useYoutubeSearch(query: string) {
  const [results, setResults] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://www.googleapis.com/youtube/v3/search`, {
            params: {
              part: 'snippet',
              q: query,
              key: YOUTUBE_API_KEY,
              type: 'video',
              maxResults: 5
            }
          }
        );

        const videos = res.data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          thumbnail: item.snippet.thumbnails.medium.url,
          channel: item.snippet.channelTitle
        }));

        setResults(videos);
      } catch (err) {
        console.error("YouTube Search Error:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => fetch(), 500); // debounce
    return () => clearTimeout(debounce);
  }, [query]);

  return { results, loading };
}
