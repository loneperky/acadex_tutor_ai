import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import supabase from "../../config/supabaseClient";
dotenv.config();

const router = Router();

// Supabase admin client
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// JWT secrets
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

// URLs
const BACKEND_URL = process.env.BACKEND_URL!;
const FRONTEND_URL = process.env.FRONTEND_URL!;

/** Shared cookie options for all auth */
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  sameSite: "lax" as const,
};

/**
 * STEP 1 — Redirect to Supabase Google OAuth
 */
router.get("/google", (req: Request, res: Response) => {
  const callbackUrl = `${BACKEND_URL}/auth/google/callback`;

  const googleAuthUrl = `${process.env.SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(
    callbackUrl
  )}`;

  res.redirect(googleAuthUrl);
});

/**
 * STEP 2 — Handle callback after Google login
 */
router.get("/google/callback", async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) {
    return res.status(400).json({ error: "Missing code from Google redirect" });
  }

  // Exchange code for Supabase session
  const tokenUrl = `${process.env.SUPABASE_URL}/auth/v1/token?grant_type=authorization_code&code=${code}&redirect_to=${encodeURIComponent(
    `${BACKEND_URL}/auth/google/callback`
  )}`;

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: process.env.SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY!}`,
    },
  });

  const data = await response.json();
  if (!data.access_token) {
    return res.status(401).json({ error: "Failed to get session from Supabase" });
  }

  // Get user from Supabase
  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(
    data.access_token
  );
  if (userError || !userData.user) {
    return res.status(401).json({ error: "Failed to fetch user" });
  }

  const user = userData.user;

  // Generate JWT tokens same as signup/login
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Set cookies same as signup/login
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 1000, // 1 hour
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Redirect to frontend dashboard
  return res.redirect(`${FRONTEND_URL}/dashboard`);
});

export { router as GoogleAuth };
