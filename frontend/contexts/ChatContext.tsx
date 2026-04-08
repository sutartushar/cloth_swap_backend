'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export interface Message {
  id: number;
  swap_id: number;
  sender_id: number;
  content: string;
  is_read: number;
  created_at: string;
  sender_name: string;
  sender_email: string;
}

interface UnreadCount {
  swap_id: number;
  unread_count: number;
}

interface ChatContextType {
  messages: Message[];
  unreadCounts: UnreadCount[];
  isLoading: boolean;
  error: string | null;
  fetchMessages: (swapId: number) => Promise<void>;
  sendMessage: (swapId: number, content: string) => Promise<void>;
  fetchUnreadCounts: () => Promise<void>;
  clearError: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<UnreadCount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const fetchMessages = async (swapId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/chat/${swapId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages(response.data.data || []);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch messages';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (swapId: number, content: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post(
        `${API_URL}/api/chat/${swapId}`,
        { content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refetch messages
      await fetchMessages(swapId);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to send message';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCounts = async () => {
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/chat/unread`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUnreadCounts(response.data.data || []);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch unread counts';
      setError(message);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        unreadCounts,
        isLoading,
        error,
        fetchMessages,
        sendMessage,
        fetchUnreadCounts,
        clearError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
