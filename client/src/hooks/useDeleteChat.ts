import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useChatHistory } from "./useChatHistory";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:5050";

export const useDeleteChat = () => {
  const [loading, setLoading] = useState(false);
  const { refresh } = useChatHistory(); // shared chat list refresh
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const deleteChat = async (chatId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await axios.delete(`/api/delete-chat/${chatId}`);

      if (response.status === 200) {
        toast.success("Chat deleted successfully");
        setSuccess(true);

        await refresh(); // ✅ update chat list in UI
        return { ok: true }; // ✅ let caller know it's successful
      } else {
        toast.error("Failed to delete chat");
        return { ok: false };
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to delete chat";
      setError(errorMsg);
      toast.error(errorMsg);
      return { ok: false }; // ✅ failure return
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, deleteChat };
};
