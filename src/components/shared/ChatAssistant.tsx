"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { BotMessageSquare, X, Send, Loader2 } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import Link from "next/link";

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  //  v5 API
  const { messages, sendMessage, status, error } = useChat();

  const [input, setInput] = useState("");

  const isLoading = status === "submitted" || status === "streaming";

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    sendMessage({ text: input });
    setInput("");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95"
      >
        <BotMessageSquare size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
        <div className="flex items-center gap-2">
          <BotMessageSquare size={20} />
          <span className="font-semibold text-sm">CourtBot AI</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-full p-1 opacity-70 hover:opacity-100 hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30 text-sm">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground mt-10">
            <p>👋 Hi! I'm CourtBot.</p>
            <p className="mt-2 text-xs">
              Ask me to find courts, e.g. "Find an indoor tennis court available
              under $50".
            </p>
          </div>
        )}

        {messages.map((m) => {
          const textSegments =
            m.parts
              ?.filter((p: any) => p.type === "text")
              .map((p: any) => p.text)
              .join("") || "";

          return (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 shadow-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-card border border-border text-foreground rounded-bl-none"
                }`}
              >
                {textSegments && (
                  <div className="prose prose-sm dark:prose-invert w-full max-w-none text-current marker:text-current [&>p]:my-0 [&>ul]:my-2 [&>li]:my-0 [&_a]:text-blue-500 hover:[&_a]:text-blue-600 [&_a]:underline">
                    <ReactMarkdown
                      components={{
                        a: ({ node, href, children, ...props }) => {
                          if (href?.startsWith("/")) {
                            return (
                              <Link href={href} className="font-medium">
                                {children}
                              </Link>
                            );
                          }
                          return (
                            <a
                              href={href!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium"
                              {...props}
                            >
                              {children}
                            </a>
                          );
                        },
                      }}
                    >
                      {textSegments}
                    </ReactMarkdown>
                  </div>
                )}

                {/* Tool handling */}
                {m.parts?.map((part: any, i: number) => {
                  if (part.type === "tool-invocation") {
                    return (
                      <div
                        key={i}
                        className="mt-2 text-xs text-muted-foreground flex items-center gap-1"
                      >
                        {part.state === "result" ? (
                          <span className="flex items-center gap-1 font-medium px-2 py-1 bg-secondary text-secondary-foreground rounded-md shadow-xs">
                            ✓ Searched Database
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 animate-pulse px-2 py-1 bg-muted rounded-md text-muted-foreground shadow-xs">
                            <Loader2 size={12} className="animate-spin" />
                            Searching courts...
                          </span>
                        )}
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          );
        })}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-bl-none px-4 py-3 text-muted-foreground shadow-sm">
              <span className="flex gap-1 items-center text-xs animate-pulse">
                Thinking...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center mt-2">
            <div className="bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-800 text-xs px-4 py-2 rounded-xl flex items-center shadow-sm max-w-[90%] text-center">
              <span>⚠️ <strong>Error:</strong> {error.message || "An unexpected error occurred."}</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-border bg-card p-3 shadow-sm"
      >
        <div className="flex items-center gap-2 rounded-full border border-input bg-background/50 px-3 py-2 transition-colors focus-within:border-ring focus-within:ring-1 focus-within:ring-ring hover:border-border">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={status !== "ready"}
            className="flex-1 bg-transparent text-sm text-foreground outline-none border-0 focus:ring-0 placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={status !== "ready" || !input.trim()}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}
