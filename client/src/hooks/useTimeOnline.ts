// hooks/useTotalTime.ts
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";

type TimeData = {
  totalSeconds: number;
  formatted: string;
};

// Optional: Helper to format seconds into hh:mm:ss
const formatDuration = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${seconds}s`;
};

/**
 * useTotalTime - Custom hook to fetch total tracked time for a user
 * @param overrideUserId (optional) - manually specify a user ID (useful for admin tools)
 */
export const useTotalTime = (overrideUserId?: string) => {
  const { user } = useAuth();
  const [data, setData] = useState<TimeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userId = overrideUserId || user?.id;

  useEffect(() => {
    const fetchTime = async () => {
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/user/total-time/${userId}`);
        const total = response.data.totalSeconds || 0;
        const formatted = formatDuration(total);

        setData({ totalSeconds: total, formatted });
      } catch (err) {
        const error = err as AxiosError;
        const message = "Failed to load time data";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchTime();
  }, [userId]);

  return { data, loading, error };
};
