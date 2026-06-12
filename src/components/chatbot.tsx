"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useContent } from "@/hooks";

type Message = { role: "user" | "bot"; content: string };

const ERROR_MESSAGE = "Something went wrong. Please try again.";

function formatMessage(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts = line
      .split(/(\*\*[^*]+\*\*)/g)
      .map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={`${i}-${j}`}>{part.slice(2, -2)}</strong>
        ) : (
          part
        ),
      );
    return (
      <span key={i}>
        {parts}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

export default function Chatbot() {
  const { content } = useContent();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/chat/status")
      .then((r) => r.json())
      .then((data) => {
        setEnabled(Boolean(data.enabled));
        if (data.enabled) {
          setMessages([
            {
              role: "bot",
              content: `Hi! I'm ${content.nickname}'s assistant. Ask me anything about ${content.nickname}'s experience, projects, skills, certifications, organizations, or how to get in touch.`,
            },
          ]);
        }
      })
      .catch(() => setEnabled(false));
  }, [content.nickname]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, streamingContent]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setStreamingContent("");

    const chatMessages = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatMessages }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Request failed");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No response body");

      let fullContent = "";
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data) as {
                choices?: { delta?: { content?: string } }[];
              };
              const delta = parsed.choices?.[0]?.delta?.content ?? "";
              if (delta) {
                fullContent += delta;
                setStreamingContent(fullContent);
              }
            } catch {
              // ignore parse errors for incomplete chunks
            }
          }
        }
      }

      const finalContent = fullContent.trim() || ERROR_MESSAGE;
      setMessages((prev) => [...prev, { role: "bot", content: finalContent }]);
      setStreamingContent("");
    } catch {
      setMessages((prev) => [...prev, { role: "bot", content: ERROR_MESSAGE }]);
      setStreamingContent("");
    } finally {
      setLoading(false);
    }
  };

  if (enabled === null) return null;
  if (!enabled) return null;

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-teal-300 text-zinc-900 shadow-lg shadow-teal-500/20 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-[#0a0a0c]"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </motion.svg>
          ) : (
            <motion.svg
              key="open"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.15 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            className="fixed bottom-24 right-6 z-40 flex h-[min(28rem,80vh)] w-[min(22rem,95vw)] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#0a0a0c] shadow-xl shadow-black/40"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/60 px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-teal-400" />
              <span className="text-sm font-medium text-zinc-200">
                {content.nickname}'s assistant
              </span>
            </div>
            <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                      m.role === "user"
                        ? "bg-teal-300/10 text-zinc-200 ring-1 ring-teal-300/20"
                        : "bg-zinc-800/80 text-zinc-300"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">
                      {m.role === "bot" ? formatMessage(m.content) : m.content}
                    </div>
                  </div>
                </div>
              ))}
              {streamingContent && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl bg-zinc-800/80 px-4 py-2 text-sm text-zinc-300">
                    <div className="whitespace-pre-wrap">
                      {formatMessage(streamingContent)}
                      <span className="inline-block w-2 h-4 ml-0.5 bg-teal-400 animate-pulse align-middle" />
                    </div>
                  </div>
                </div>
              )}
              {loading && !streamingContent && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-zinc-800/80 px-4 py-2 text-sm text-zinc-400 animate-pulse">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-zinc-800 bg-zinc-900/40 p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  disabled={loading}
                  className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-300 placeholder-zinc-500 outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/50 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-teal-300 px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-60"
                >
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
