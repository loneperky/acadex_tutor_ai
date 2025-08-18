import express, { Request, Response } from 'express';
import axios from 'axios';
import { authMiddleware } from '../config/middleware';
import supabase from '../config/supabaseClient';


const router = express.Router();

// send a message
router.post('/send-message', authMiddleware, async (req: Request, res: Response) => {
  const { message, chat_id } = req.body;
  const userId = (req as any).user?.userId;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message format' });
  }

  let chatIdToUse = chat_id;
  let generatedTitle = 'Untitled Chat';

  try {
    // 1. If no chat_id, generate a new chat
    if (!chatIdToUse) {
      // 1. Generate title
      const titleRes = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-70b-8192',
          messages: [
            {
              role: 'system',
              content:
                'Generate a short educational title (max 4 words) for this conversation. Return only the title—no greetings or extra text.',
            },
            { role: 'user', content: message },
          ],
          temperature: 0.7,
          
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY!}`,
            'Content-Type': 'application/json',
          },
        }
      );

      let generatedTitle =
        titleRes.data.choices?.[0]?.message?.content?.trim() || 'Untitled Chat';

      // 2. Generate subject emphasis
      const subjectRes = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-70b-8192',
          messages: [
            {
              role: 'system',
              content:
                "From the given conversation, extract only the most relevant academic subject or course title. Do not include greetings, punctuation, or extra words. Respond with a single subject or course name only, e.g., 'Physics', 'Computer Science', or 'Modern European History'. If the subject is unclear, respond with 'General Studies."
            },
            { role: 'user', content: message },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY!}`,
            'Content-Type': 'application/json',
          },
        }
      );

      let generatedSubject =
        subjectRes.data.choices?.[0]?.message?.content?.trim() || 'General';

      generatedSubject = generatedSubject.replace(/[^a-zA-Z0-9\s]/g, '').trim();

      // 3. Insert chat with both title and subject_emphasis
      const { data: chatInsertData, error: chatInsertError } = await supabase
        .from('chats')
        .insert({
          user_id: userId,
          title: generatedTitle,
          subject_emphasis: generatedSubject, // ✅ Here it is
        })
        .select('id')
        .single();

      if (chatInsertError) {
        console.error('Error creating chat:', chatInsertError);
        return res.status(500).json({ error: 'Failed to create chat' });
      }

      chatIdToUse = chatInsertData.id;
    }


    // 2. Insert user message
    const { error: userInsertError } = await supabase.from('messages').insert({
      user_id: userId,
      role: 'user',
      content: message,
      chat_id: chatIdToUse,
    });

    if (userInsertError) {
      console.error("Error inserting user message:", userInsertError);
      return res.status(500).json({ error: 'Failed to save message' });
    }

    // 3. Get full chat history
    const { data: history, error: historyError } = await supabase
      .from('messages')
      .select('role, content')
      .eq('chat_id', chatIdToUse)
      .order('created_at', { ascending: true });

    if (historyError) {
      console.error("Error fetching chat history:", historyError);
      return res.status(500).json({ error: 'Failed to retrieve chat history' });
    }


    const messagesForGroq = history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // 4. Get AI response
    const aiResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: messagesForGroq,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY!}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const assistantReply = aiResponse.data.choices?.[0]?.message?.content?.trim()
      || "I'm not sure how to respond to that.";

    // 5. Save AI response
    const { error: assistantInsertError } = await supabase.from('messages').insert({
      user_id: userId,
      role: 'assistant',
      content: assistantReply,
      chat_id: chatIdToUse,
    });

    if (assistantInsertError) {
      console.error("Error saving assistant reply:", assistantInsertError);
      return res.status(500).json({ error: 'Failed to save assistant reply' });
    }

    res.status(200).json({
      success: true,
      reply: assistantReply,
      chat_id: chatIdToUse,
    });

  } catch (err: any) {
    console.error('Groq API error:', err.response?.data || err.message || err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// get a chat ie group of related messages
router.get("/chat-history/:chatId", authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { chatId } = req.params;

  try {
    // Check if the chat belongs to the user
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .select('id,title,created_at')
      .eq('id', chatId)
      .eq('user_id', userId)
      .single();

    if (chatError || !chat) {
      return res.status(403).json({ error: "Chat not found or access denied" });
    }

    // Fetch full message history for the chat
    const { data: messages, error: messageError } = await supabase
      .from('messages')
      .select('role, content, created_at')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (messageError) {
      console.error("Error fetching messages:", messageError);
      return res.status(500).json({ error: 'Failed to retrieve messages' });
    }

    res.status(200).json({
      success: true,
      chat_id: chatId,
      messages,
    });

  } catch (error) {
    console.error("Chat history error:", error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// get all messages sent 
router.get("/sent-messages", authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  try {
    const { data: mssgs, error: MssgsError } = await supabase
      .from("messages")
      .select("*", { count: 'exact' })
      .eq("user_id", userId)
      .eq("role", "user")

    if (MssgsError) {
      console.error("Error Fetching messages", MssgsError)
      return res.status(500).json({ error: "Failed to fetch messages histoty" })
    }
    return res.status(200).json({ mssgs })

  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ error: "Failed to fetch messages history" });
  }
})

// get all chats 
router.get("/chats-history", authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;

  try {
    const { data: chats, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching chats:", error);
      return res.status(500).json({ error: "Failed to fetch chat history" });
    }

    res.status(200).json({ success: true, chats });
  } catch (error) {
    console.error("Fetch all chats error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.delete( "/delete-chat/:chatId", authMiddleware,  async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId; // extracted from JWT in authMiddleware
    const { chatId } = req.params;

    try {
      // 1. Check if the chat belongs to the user
      const { data: chat, error: chatError } = await supabase
        .from("chats")
        .select("id")
        .eq("id", chatId)
        .eq("user_id", userId)
        .single();

      if (chatError || !chat) {
        return res
          .status(403)
          .json({ error: "Chat not found or access denied" });
      }

      // 2. Delete the chat
      const { error: deleteError } = await supabase
        .from("chats")
        .delete()
        .eq("id", chatId)
        .eq("user_id", userId);

      if (deleteError) {
        console.error("Delete error:", deleteError);
        return res.status(500).json({ error: "Failed to delete chat" });
      }

      return res.status(200).json({ message: "Chat deleted successfully" });
    } catch (error) {
      console.error("Chat deletion error:", error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
);

export { router as GroqAI };
