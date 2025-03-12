"use client";
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message as MessageType } from '../types';
import Message from './Message';
import { SSEClient } from '../lib/sse';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

export default function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(() => uuidv4());
  const sseClientRef = useRef<SSEClient | null>(null);

  useEffect(() => {
    sseClientRef.current = new SSEClient((event) => {
      switch (event.type) {
        case 'chunk':
          setMessages((prev) => {
            
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.toolOutput) {
              return [
                ...prev.slice(0, -1),
                { ...lastMessage, content: lastMessage.content + event.data },
              ];
            }
            return [
              ...prev,
              { id: uuidv4(), role: 'assistant', content: event.data },
            ];
          });
          break;
        case 'tool_use':
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
              return [
                ...prev.slice(0, -1),
                { ...lastMessage, toolUse: event.data },
              ];
            }
            return prev;
          });
          break;
        case 'tool_output':
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
              return [
                ...prev.slice(0, -1),
                { ...lastMessage, toolOutput: event.data },
              ];
            }
            return prev;
          });
          break;
        case 'end':
          setIsLoading(false);
          break;
      }
    });

    return () => {
      if (sseClientRef.current) {
        sseClientRef.current.disconnect();
      }
    };
  },[]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: MessageType = {
      id: uuidv4(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(false);

    if (sseClientRef.current) {
      sseClientRef.current.connect(input, sessionId);
    }
  };

  const handleSelectTimeSlot = (slot: any) => {
    setInput(`I'd like to schedule an appointment for ${slot.date} at ${slot.time}`);
  };
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            onSelectTimeSlot={handleSelectTimeSlot}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg text-black border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
