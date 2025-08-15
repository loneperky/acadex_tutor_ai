import { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://acadextutorai-production.up.railway.app";
// axios.defaults.baseURL = "http://localhost:5050";

export interface MssgItems {
  id: string;
  date: Date;
}

export const useMssgHistory = () => {
  const [messages, setMessages] = useState<MssgItems[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/sent-messages");
      if (res.data?.mssgs) {
        setMessages(res.data.mssgs);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return { messages, loading };
};
