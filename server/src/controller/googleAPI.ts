// routes/youtube.ts
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { authMiddleware } from "../config/middleware";
dotenv.config();
const router = express.Router();

router.get("/search", authMiddleware, async (req, res) => {
  const { query } = req.query;
  try {
    const apiKey = process.env.YOUTUBE_API_KEY; // store securely
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          q: `${query} tutorial OR lecture OR course OR lesson OR class`,
          part: "snippet",
          maxResults: 13,
          type: "video",
          videoDuration: "long",
          videoCategoryId: "27",
          safeSearch: "strict",
          order: "relevance",
          key: apiKey,
        },
      }
    );
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error("YouTube API error:", error);
    res.status(500).json({ error: "Failed to fetch YouTube videos" });
  }
});



router.get("/video/:videoId", async (req, res) => {
  const { videoId } = req.params;

  try {
    const { data } = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "snippet",
          id: videoId,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    if (data.items.length === 0) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json(data.items[0]); // Return the full video details
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ error: "Failed to fetch video details" });
  }
});


export default router;
