import express, { Request, Response } from 'express';
import supabase from '../../config/supabaseClient';
import { authMiddleware } from '../../config/middleware';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const apiKey = process.env.YOUTUBE_API_KEY as string;

// POST /user/bookmarks
router.post('/bookmarks', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { type, item_id } = req.body;
    const userId = (req as any).user?.userId;

    if (!type || !item_id) {
      return res.status(400).json({ error: 'type and item_id are required' });
    }

    // Check if already bookmarked
    const { data: existing, error: checkError } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('type', type)
      .eq('item_id', item_id)
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError) throw checkError;
    if (existing) {
      return res.status(400).json({ message: 'Already bookmarked' });
    }

    // Insert bookmark
    const { data, error } = await supabase
      .from('bookmarks')
      .insert([{ user_id: userId, type, item_id }])
      .select('*')
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Bookmarked', bookmark: data });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /user/bookmarks?type=chat
router.get('/bookmarks', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { type } = req.query;

    if (type && typeof type !== 'string') {
      return res.status(400).json({ error: 'type must be a string' });
    }

    // Base query
    let bookmarksQuery = supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (type) {
      bookmarksQuery = bookmarksQuery.eq('type', type);
    }

    const { data: bookmarks, error } = await bookmarksQuery;
    if (error) throw error;

    // Helper to fetch details
    const fetchItemDetails = async (bookmark: any) => {
      switch (bookmark.type) {
        case 'chat': {
          const { data } = await supabase
            .from('chats')
            .select('id, title, subject_emphasis, created_at')
            .eq('id', bookmark.item_id)
            .single();
          return data;
        }
        case 'video': {
          const ytData = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${bookmark.item_id}&key=${apiKey}`
          ).then(res => res.json());
          if (ytData.items?.length) {
            const vid = ytData.items[0];
            return {
              id: bookmark.item_id,
              title: vid.snippet.title,
              thumbnail: vid.snippet.thumbnails.high.url,
              publishedAt: vid.snippet.publishedAt
            };
          }
          return null;
        }
        case 'resource': {
          const { data } = await supabase
            .from('resources')
            .select('id, title, link, description, created_at')
            .eq('id', bookmark.item_id)
            .single();
          return data;
        }
        case 'question': {
          const { data } = await supabase
            .from('questions')
            .select('id, content, answer, created_at')
            .eq('id', bookmark.item_id)
            .single();
          return data;
        }
        default:
          return null;
      }
    };

    // Get detailed bookmarks
    const detailedBookmarks = await Promise.all(
      bookmarks.map(async bookmark => ({
        ...bookmark,
        item: await fetchItemDetails(bookmark)
      }))
    );

    res.status(200).json({ bookmarks: detailedBookmarks });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /user/bookmarks/:type/:itemId
router.get('/bookmarks/:type/:itemId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { type, itemId } = req.params;

    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('type', type)
      .eq('item_id', itemId)
      .maybeSingle();

    if (error) throw error;
    res.status(200).json({ bookmarked: !!data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /user/bookmarks/:type/:itemId
router.delete('/bookmarks/:type/:itemId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { type, itemId } = req.params;

    if (!type || !itemId) {
      return res.status(400).json({ error: 'type and itemId are required' });
    }

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('type', type)
      .eq('item_id', itemId);

    if (error) throw error;
    res.status(200).json({ message: 'Bookmark removed' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export { router as Bookmark };
