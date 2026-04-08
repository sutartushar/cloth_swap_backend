'use client';

import { useEffect, useState } from 'react';
import { useSwap } from '@/contexts/SwapContext';
import { useChat } from '@/contexts/ChatContext';
import SwapRequestCard from './SwapRequestCard';
import ChatModal from './ChatModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

export default function SwapsPage() {
  const { incomingSwaps, outgoingSwaps, isLoading, error, fetchIncomingSwaps, fetchOutgoingSwaps } = useSwap();
  const { fetchMessages } = useChat();
  const [selectedSwapId, setSelectedSwapId] = useState<number | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    fetchIncomingSwaps();
    fetchOutgoingSwaps();
  }, []);

  const handleChatOpen = async (swapId: number) => {
    setSelectedSwapId(swapId);
    await fetchMessages(swapId);
    setShowChat(true);
  };

  if (isLoading && incomingSwaps.length === 0 && outgoingSwaps.length === 0) {
    return (
      <div className="container py-12">
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Swaps</h1>

      {error && <div className="error-message mb-6">{error}</div>}

      <Tabs defaultValue="incoming">
        <TabsList>
          <TabsTrigger value="incoming">
            Incoming ({incomingSwaps.length})
          </TabsTrigger>
          <TabsTrigger value="outgoing">
            Outgoing ({outgoingSwaps.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="mt-6">
          {incomingSwaps.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg">No incoming swap requests</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {incomingSwaps.map((swap) => (
                <SwapRequestCard
                  key={swap.id}
                  swap={swap}
                  type="incoming"
                  onChatClick={() => handleChatOpen(swap.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="outgoing" className="mt-6">
          {outgoingSwaps.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg">No outgoing swap requests</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {outgoingSwaps.map((swap) => (
                <SwapRequestCard
                  key={swap.id}
                  swap={swap}
                  type="outgoing"
                  onChatClick={() => handleChatOpen(swap.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {showChat && selectedSwapId && (
        <ChatModal
          swapId={selectedSwapId}
          onClose={() => {
            setShowChat(false);
            setSelectedSwapId(null);
          }}
        />
      )}
    </div>
  );
}
