import { useState, useEffect } from "react";
import axios from "axios";

export interface ChatItem {
  id: string;
  title: string;
  subject_emphasis: string;
  created_at: string;
}

export function useChatHistory() {
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChatHistory = async () => {
    try {
      const res = await axios.get("/api/chats-history");
      setChatHistory(res.data.chats || []);
    } catch (err) {
      console.error("Failed to load chat history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  return { chatHistory, loading, refresh: fetchChatHistory };
}
