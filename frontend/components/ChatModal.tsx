'use client';

import { useEffect, useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { X, Send } from 'lucide-react';

interface ChatModalProps {
  swapId: number;
  onClose: () => void;
}

export default function ChatModal({ swapId, onClose }: ChatModalProps) {
  const { messages, isLoading, fetchMessages, sendMessage } = useChat();
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages(swapId);
    const interval = setInterval(() => {
      fetchMessages(swapId);
    }, 5000);

    return () => clearInterval(interval);
  }, [swapId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setSending(true);
    try {
      await sendMessage(swapId, messageText);
      setMessageText('');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50">
      <div className="bg-white w-full md:w-96 h-[600px] md:h-[700px] rounded-t-lg md:rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-4 rounded-t-lg md:rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-bold">Chat - Swap #{swapId}</h2>
          <button
            onClick={onClose}
            className="hover:bg-indigo-700 p-1 rounded transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading && messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="loading-spinner"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-600 mt-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="mb-4">
                <div className="text-xs text-gray-500 mb-1">
                  {message.sender_name} • {new Date(message.created_at).toLocaleTimeString()}
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-gray-800">{message.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="border-t p-4 flex gap-2">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <button
            type="submit"
            disabled={sending || !messageText.trim()}
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
