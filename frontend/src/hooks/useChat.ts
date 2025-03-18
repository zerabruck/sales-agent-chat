import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message as MessageType, ToolOutput } from '../types';
import { SSEClient } from '../lib/sse';

export const useChat = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const sseClientRef = useRef<SSEClient | null>(null);

  useEffect(() => {
    sseClientRef.current = new SSEClient((event) => {
      setIsLoading(false);
      switch (event.type) {
        case 'chunk':
          setMessages((prev:MessageType[]) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.toolOutput) {
              return [...prev.slice(0, -1), { ...lastMessage, content: lastMessage.content + event.data }];
            }
            return [...prev, { id: uuidv4(), role: 'assistant', content: event.data }];
          });
          break;
        case 'tool_use':
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
              return [...prev.slice(0, -1), { ...lastMessage, toolUse: event.data }];
            }
            return prev;
          });
          break;
        case 'tool_output':
          setIsLoading(true)
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
              return [...prev.slice(0, -1), { ...lastMessage, toolOutput: event.data as unknown as ToolOutput }];
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
  }, []);

  const sendMessage = (content: string) => {
    setIsLoading(true);
    if (!content.trim()) return;

    const userMessage: MessageType = {
      id: uuidv4(),
      role: 'user',
      content,
    };

    setMessages((prev:MessageType[]) => [...prev, userMessage]);
    setInput('');

    if (sseClientRef.current) {
      sseClientRef.current.connect(content, sessionId);
    }
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
  };
}; 