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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Assuming the hook returns an object with `orderBook` containing bids and asks
  const { orderBook } = useBinanceWebSocket({ bookFor: symbol });

  useEffect(() => {
    if (orderBook) {
      // Save the previous state for trend comparison
      setPreviousBids(bids);
      setPreviousAsks(asks);

      // Update the current state with parsed data
      setBids(
        orderBook.bids.map(([price, quantity]: [string, string]) => ({
          price,
          quantity,
        }))
      );
      setAsks(
        orderBook.asks.map(([price, quantity]: [string, string]) => ({
          price,
          quantity,
        }))
      );
      setIsLoading(false); // Data loaded
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

  if (isLoading) {
    return (
      <div className="p-6 text-center mt-16 ">
        <div className="lds-circle flex items-center justify-center animate-bounce ">
          <div className="text-2xl font-bold">B</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-center flex-col sm:flex-row gap-8 max-w-7xl m-auto">
        {/* Bids Table */}
        <BidsTable
          label={"Bids"}
          bids={bids}
          previousBids={previousBids}
          getTrend={getTrend}
        />

        {/* Asks Table */}
        <BidsTable
          label={"Asks"}
          bids={asks}
          previousBids={previousAsks}
          getTrend={getTrend}
        />
      </div>
    </div>
  );
};

export default OrderBook;
