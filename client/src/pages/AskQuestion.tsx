import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Send, Bot, Book, Mic, Paperclip, Copy } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { Message } from "@/types";
import BookmarkToggleButton from "@/utils/bookmarkButton";

export default function AskQuestion() {
  const { chatId } = useParams(); // ✅ gets chatId from URL
  const { sendMessage, setMessages, messages, loadChatHistory } = useChat();

  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat history
  useEffect(() => {
    const loadChat = async () => {
      if (chatId) {
        try {
          const res = await axios.get(`/api/chat-history/${chatId}`);
          loadChatHistory(chatId); // Load into context
          setMessages(res.data.messages);
        } catch (err) {
          console.error("Failed to load chat history:", err);
          setMessages([
            {
              id: 1,
              content: "Failed to load previous messages.",
              role: "assistant",
              timestamp: new Date(),
            },
          ]);
        }
      } else {
        // Default assistant message
        setMessages([
          {
            id: 1,
            content:
              "Hi! I'm your AI Academic Tutor. Ask me anything about your studies - from basic concepts to complex problems. How can I help you learn today?",
            role: "assistant",
            timestamp: new Date(),
          },
        ]);
      }
    };

    loadChat();
  }, [chatId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      content: currentQuestion,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentQuestion("");
    setIsLoading(true);

    try {
      await sendMessage(currentQuestion);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        content: "Error: Could not fetch response from the server.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex sticky flex-col max-w-4xl mx-auto h-full">
      {/* Chat Header */}
      <div className="flex justify-between items-center p-2 border-b border-border">
        <h2 className="text-lg font-semibold">Your Conversation</h2>

        {chatId && <BookmarkToggleButton itemId={chatId} type="chat" />}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-green-700">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <Card
              className={`relative max-w-[80%] p-4 ${message.role === "user"
                  ? "bg-gray-700 text-primary-foreground"
                  : "bg-card"
                }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>

              {message.role === "assistant" && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(message.content);
                    setCopiedId(message.id);
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  className="absolute bottom-2 right-2 text-muted-foreground transition"
                >
                  {copiedId === message.id ? (
                    <span className="text-xs">copied</span>
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              )}
            </Card>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <Card className="max-w-[80%] p-4 bg-card">
              <LoadingSpinner size="sm" />
              <p className="text-sm text-muted-foreground mt-2">Thinking...</p>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 p-4 border-t border-border bg-card/50 backdrop-blur">
        <form onSubmit={handleSubmit} className="flex gap-2 relative">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your studies..."
              className="min-h-[50px] max-h-32 resize-none pr-20 bg-input border-border"
              disabled={isLoading}
            />

            <button
              type="button"
              disabled
              className="absolute bottom-2 right-10 h-8 w-8 p-0 text-muted-foreground"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            <button
              type="button"
              disabled
              className="absolute bottom-2 right-20 h-8 w-8 p-0 text-muted-foreground"
            >
              <Mic className="h-4 w-4" />
            </button>

            <Button
              type="submit"
              size="sm"
              className="absolute right-2 bottom-2 h-8 w-8 p-0"
              disabled={!currentQuestion.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <Book className="h-3 w-3" />
          <span>
            Pro tip: Be specific with your questions for better explanations!
          </span>
        </div>
      </div>
    </div>
  );
}
