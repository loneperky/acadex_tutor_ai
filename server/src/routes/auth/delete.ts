import express, { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { authMiddleware } from "../../config/middleware";
import supabase from "../../config/supabaseClient";
const router = express.Router();

// Use service role key to initialize admin client

router.delete("/delete", authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;

  if (!userId) {
    return res.status(400).json({ error: "Missing user ID" });
  }

  // Delete the user from Supabase Auth
  const { error } = await supabase.auth.admin.deleteUser(userId);

  // Clear cookies regardless of success
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  if (error) {
    return res.status(500).json({ error: error.message || "Failed to delete user" });
  }

  return res.status(200).json({ message: "User deleted from auth successfully" });
});

export { router as DeleteRoute };
