"use client";
import React, { useRef, useEffect } from "react";
import {TimeSlot } from "../types";
import Message from "./Message";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import AssistantLoader from "./AssistantLoader";
import { useChat } from "../hooks/useChat";

export default function Chat() {
  const { messages, input, setInput, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSelectTimeSlot = (slot: TimeSlot) => {
    setInput(`I'd like to schedule an appointment for ${slot.date} at ${slot.time}`);
  };

  return (
    <div className="flex overflow-y-auto pt-8 mx-auto flex-col items-center justify-center">
      <div className={`transition-all lg:w-[60rem] w-full ${messages && messages?.length > 0 ? "flex-1" : ""} px-2 py-4 space-y-6`}>
        {messages && messages?.map((message, index) => (
          <div key={message.id} className={`${messages.length === index + 1 && !isLoading && "mb-70"}`}>
            <Message message={message} onSelectTimeSlot={handleSelectTimeSlot} />
          </div>
        ))}
        {isLoading && <AssistantLoader />}
        <div ref={messagesEndRef} />
      </div>
      
      <div className={`${messages?.length !== 0 && "fixed bottom-0"} w-full`}>
        {messages?.length === 0 && (
          <h2 className="text-center text-4xl font-bold mb-10 mt-[30vh]">
            Your Next Car, Just a Chat Away!
          </h2>
        )}
        <form onSubmit={handleSubmit} className="p-4 lg:mb-4 lg:w-[60rem] w-full mx-auto transition-all bg-[#212124] rounded-2xl">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about car models, pricing, or schedule a test drive..."
              className="flex-1 rounded-lg text-white px-4 py-2 focus:outline-none focus:border-[#381a2a]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`${input ? "bg-[#6A1E55]" : "bg-[#3B1C32]"} text-white rounded-lg px-4 py-2 hover:bg-[#3B1C32] focus:outline-none focus:ring-2 focus:ring-[#381a2a] disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
