"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiArrowUp, FiX } from "react-icons/fi";
import { useContent } from "@/hooks";
import { MAX_USER_CHARS } from "@/lib/chat";

type Message = { role: "user" | "bot"; content: string };

const ERROR_MESSAGE = "Something went wrong. Please try again.";

function formatMessage(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        // biome-ignore lint/suspicious/noArrayIndexKey: positional text segments have no stable id
        return <strong key={`${i}-${j}`}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
    return (
      // biome-ignore lint/suspicious/noArrayIndexKey: rendered text lines have no stable id
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
  }, []);

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
        // The server's reason (busy, too long) is written for visitors.
        const data = await res.json().catch(() => ({}));
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: data.error || ERROR_MESSAGE },
        ]);
        return;
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
        className="fixed right-4 bottom-4 z-50 inline-flex h-12 items-center gap-2.5 rounded-full bg-ink px-5 font-mono text-[11px] uppercase tracking-[0.2em] text-paper shadow-lg shadow-ink/20 transition-colors hover:bg-accent sm:right-6 sm:bottom-6"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {isOpen ? (
          <FiX aria-hidden className="h-4 w-4" />
        ) : (
          <span aria-hidden className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70 motion-reduce:animate-none" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
        )}
        <span>{isOpen ? "Close" : "Ask my AI"}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            role="dialog"
            aria-label={`${content.nickname}'s assistant`}
            className="fixed right-4 bottom-20 z-40 flex h-[min(32rem,75vh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-rule bg-paper shadow-2xl shadow-ink/15 sm:right-6 sm:bottom-22"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
          >
            <div className="border-b border-rule px-5 py-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                <span className="text-accent">(AI)</span> Assistant
              </p>
              <p className="mt-1 font-serif text-2xl leading-none text-ink">
                Ask about {content.nickname}
                <span className="text-accent">.</span>
              </p>
            </div>
            <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto p-5">
              {messages.map((m, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: append-only chat log
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-2xl rounded-br-sm bg-ink px-4 py-2 text-paper"
                        : "border-l-2 border-accent pl-3 text-ink"
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
                  <div className="max-w-[85%] border-l-2 border-accent pl-3 text-sm leading-relaxed text-ink">
                    <div className="whitespace-pre-wrap">
                      {formatMessage(streamingContent)}
                      <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-accent align-middle" />
                    </div>
                  </div>
                </div>
              )}
              {loading && !streamingContent && (
                <div className="flex justify-start">
                  <div className="animate-pulse border-l-2 border-rule pl-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                    Thinking…
                  </div>
                </div>
              )}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2 border-t border-rule px-3 py-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                maxLength={MAX_USER_CHARS}
                aria-label="Message"
                disabled={loading}
                className="flex-1 bg-transparent px-2 py-2 text-sm text-ink placeholder-muted outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper transition-colors hover:bg-accent disabled:opacity-40"
              >
                <FiArrowUp className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
