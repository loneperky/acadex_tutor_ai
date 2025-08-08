import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import supabase from '../../config/supabaseClient';
import { authMiddleware } from '../../config/middleware';

dotenv.config();
const router = express.Router();



// GET profile route
router.get("/profile", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID not found in request." });
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ user: data });
  } catch (error: any) {
    console.error("Unexpected error in GET /profile:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});


// PATCH profile update route
router.patch("/profile", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID not found in request." });
    }

    const {
      academic_level,
      study_field,
      institution,
      country,
      phone_number,
      language,
      linkedin,
      website,
      dob,
      gender,
      research_interest,
      bio,
      avatar_url,
    } = req.body;

    const updateFields: any = {
      academic_level,
      study_field,
      institution,
      country,
      language,
      research_interest,
      bio,
      avatar_url,
      gender,
      phone_number,
      dob,
      website,
      linkedin,
      updated_at: new Date().toISOString()
    };

    // remove undefined fields
    Object.keys(updateFields).forEach(
      (key) => updateFields[key] === undefined && delete updateFields[key]
    );



    const { data, error } = await supabase
      .from("profiles")
      .update(updateFields)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: "Profile updated successfully", user: data });
  } catch (error: any) {
    console.error("Unexpected error in PATCH /profile:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export { router as ProfileRoute };
