import express, { Request, Response } from 'express';
import supabase from '../../config/supabaseClient';
import { authMiddleware } from '../../config/middleware';

const router = express.Router();

// POST /user/bookmarks
router.post('/bookmarks', authMiddleware, async (req: Request, res: Response) => {
  const { type, item_id } = req.body;
  const userId = (req as any).user?.userId;

  if (!type || !item_id) {
    return res.status(400).json({ error: 'type and item_id are required' });
  }

  const { data: existing } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("type", type)
    .eq("item_id", item_id)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    return res.status(400).json({ message: "Already bookmarked" });
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .insert([{ user_id: userId, type, item_id }])
    .select("*")
    .single();

  if (error) return res.status(400).json({ error: error.message });

  return res.status(201).json({ message: "Bookmarked", bookmark: data });
});

// GET /user/bookmarks?type=chat
router.get('/bookmarks', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { type } = req.query;

  try {
    if (type && typeof type !== 'string') {
      return res.status(400).json({ error: "type must be a string" });
    }

    let bookmarksQuery = supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // If type is passed, filter it
    if (type) {
      bookmarksQuery = bookmarksQuery.eq('type', type);
    }

    const { data: bookmarks, error } = await bookmarksQuery;

    if (error) return res.status(500).json({ error: error.message });

    // Fetch related item details for each bookmark
    const detailedBookmarks = await Promise.all(
      bookmarks.map(async (bookmark) => {
        let itemDetails = null;

        if (bookmark.type === 'chat') {
          const { data } = await supabase
            .from('chats')
            .select('id, title, subject_emphasis, created_at')
            .eq('id', bookmark.item_id)
            .single();
          itemDetails = data;
        } else if (bookmark.type === 'video') {
          const { data } = await supabase
            .from('videos')
            .select('id, title, url, created_at')
            .eq('id', bookmark.item_id)
            .single();
          itemDetails = data;
        } else if (bookmark.type === 'resource') {
          const { data } = await supabase
            .from('resources')
            .select('id, title, link, description, created_at')
            .eq('id', bookmark.item_id)
            .single();
          itemDetails = data;
        } else if (bookmark.type === 'question') {
          const { data } = await supabase
            .from('questions')
            .select('id, content, answer, created_at')
            .eq('id', bookmark.item_id)
            .single();
          itemDetails = data;
        }

        return {
          ...bookmark,
          item: itemDetails,
        };
      })
    );

    return res.status(200).json({ bookmarks: detailedBookmarks });

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});




// GET /user/bookmarks/:type/:itemId
router.get('/bookmarks/:type/:itemId', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { type, itemId } = req.params;

  const { data, error } = await supabase
    .from("bookmarks")
    .select("")
    .eq("user_id", userId)
    .eq("type", type)
    .eq("item_id", itemId)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ bookmarked: !!data });
});

// DELETE /user/bookmarks/:type/:itemId
router.delete('/bookmarks/:type/:itemId', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { type, itemId } = req.params;

  if (!type || !itemId) {
    return res.status(400).json({ error: 'type and itemId are required' });
  }

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", userId)
    .eq("type", type)
    .eq("item_id", itemId);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ message: "Bookmark removed" });
});

export { router as Bookmark };
