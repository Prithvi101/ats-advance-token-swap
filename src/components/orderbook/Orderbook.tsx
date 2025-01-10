"use client";
import useBinanceWebSocket from "@/hooks/useBinanceWebSocket";
import React, { useEffect, useState } from "react";
import BidsTable from "./BidsTable";

// Define types for the bids and asks data
export interface OrderBookEntry {
  price: string;
  quantity: string;
}

interface OrderBookProps {
  symbol?: string; // tradingPair is optional, defaulting to 'btcusdt'
}

const OrderBook: React.FC<OrderBookProps> = ({ symbol = "btc" }) => {
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [previousBids, setPreviousBids] = useState<OrderBookEntry[]>([]);
  const [previousAsks, setPreviousAsks] = useState<OrderBookEntry[]>([]);

  // Assuming the hook returns an object with `orderBook` containing bids and asks
  const { orderBook } = useBinanceWebSocket({
    bookFor: symbol,
  });
  const { buyPrices } = useBinanceWebSocket({
    buySymbol: symbol,
  });

  useEffect(() => {
    if (orderBook) {
      // Save the previous state for trend comparison
      setPreviousBids(bids);
      setPreviousAsks(asks);

      // Update the current state with parsed data
      setBids(
        orderBook.bids?.map?.(([price, quantity]: [string, string]) => ({
          price,
          quantity,
        }))
      );
      setAsks(
        orderBook.asks?.map?.(([price, quantity]: [string, string]) => ({
          price,
          quantity,
        }))
      );
    }
  }, [orderBook]); // Added `bids` and `asks` to dependency array

  const getTrend = (
    currentPrice: string,
    previousPrices: OrderBookEntry[],
    index: number
  ) => {
    if (!previousPrices[index]) return null;
    return parseFloat(currentPrice) > parseFloat(previousPrices[index].price)
      ? "up"
      : "down";
  };

  return (
    <div className="flex flex-col  mx-auto p-10 rounded-2xl shadow-2xl ">
      {/* Header */}

      {/* Bids Table */}
      <div className="mb-6">
        <BidsTable
          showHead
          bids={bids}
          previousBids={previousBids}
          getTrend={getTrend}
        />
      </div>

      {/* Current Price */}
      <div className="text-center mb-6 flex items-center justify-center">
        <p className="text-4xl font-bold text-center text-neon-green animate-pulse">
          ${buyPrices?.price}
        </p>
      </div>

      {/* Asks Table */}
      <div>
        <BidsTable
          bids={asks}
          previousBids={previousAsks}
          getTrend={getTrend}
        />
      </div>
    </div>
  );
};

export default OrderBook;
