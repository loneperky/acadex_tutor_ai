// src/utils/uploadAvatar.ts
import supabase from "@/config/supabaseClient"

export const uploadAvatar = async (file: File, userId: string) => {
  const fileExt = file.name.split(".").pop();
  const filePath = `avatars/${userId}.${fileExt}`

  const { data, error } = await supabase.storage
    .from("avatar")
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw error;

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};
