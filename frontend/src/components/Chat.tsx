"use client";
import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message as MessageType } from "../types";
import Message from "./Message";
import { SSEClient } from "../lib/sse";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

export default function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(() => uuidv4());
  const sseClientRef = useRef<SSEClient | null>(null);

  useEffect(() => {
    sseClientRef.current = new SSEClient((event) => {
      switch (event.type) {
        case "chunk":
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (
              lastMessage &&
              lastMessage.role === "assistant" &&
              !lastMessage.toolOutput
            ) {
              return [
                ...prev.slice(0, -1),
                { ...lastMessage, content: lastMessage.content + event.data },
              ];
            }
            return [
              ...prev,
              { id: uuidv4(), role: "assistant", content: event.data },
            ];
          });
          break;
        case "tool_use":
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.role === "assistant") {
              return [
                ...prev.slice(0, -1),
                { ...lastMessage, toolUse: event.data },
              ];
            }
            return prev;
          });
          break;
        case "tool_output":
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.role === "assistant") {
              return [
                ...prev.slice(0, -1),
                { ...lastMessage, toolOutput: event.data },
              ];
            }
            return prev;
          });
          break;
        case "end":
          setIsLoading(false);
          break;
      }
    });

    return () => {
      if (sseClientRef.current) {
        sseClientRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: MessageType = {
      id: uuidv4(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(false);

    if (sseClientRef.current) {
      sseClientRef.current.connect(input, sessionId);
    }
  };

  const handleSelectTimeSlot = (slot: any) => {
    setInput(
      `I'd like to schedule an appointment for ${slot.date} at ${slot.time}`
    );
  };
  return (
    <div
      className={`flex  overflow-y-auto  pt-8 mx-auto flex-col  items-center justify-center`}
    >
      <div
        className={`transition-all lg:w-[60rem] w-full ${
          messages.length > 0 ? "flex-1" : ""
        }   px-2 py-4 space-y-6`}
      >
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`${messages.length === index + 1 && "mb-52"}`}
          >
            <Message
              key={message.id}
              message={message}
              onSelectTimeSlot={handleSelectTimeSlot}
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={`${messages.length !== 0 && "fixed bottom-0"} w-full`}>
        {messages.length === 0 && (
          <h2 className="text-center text-4xl font-bold  mb-10 mt-[30vh]">
            Your Next Car, Just a Chat Away!
          </h2>
        )}
        <form
          onSubmit={handleSubmit}
          className="p-4 lg:mb-4  lg:w-[60rem] w-full mx-auto transition-all bg-[#212124] rounded-2xl "
        >
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about car models, pricing, or schedule a test drive..."
              className="flex-1 rounded-lg text-white borer border-gry-600 px-4 py-2 focus:outline-none focus:border-[#381a2a] "
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={` ${
                input ? " bg-[#6A1E55]" : "bg-[#3B1C32]"
              } text-white rounded-lg px-4 py-2 hover:bg-[#3B1C32] focus:outline-none focus:ring-2 focus:ring-[#381a2a] disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
