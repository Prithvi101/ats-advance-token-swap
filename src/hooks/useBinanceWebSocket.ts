"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { throttle } from "lodash";

// WebSocket base URL
const BINANCE_WS_URL = "wss://stream.binance.com:9443/ws/";

// Define the types for WebSocket response data and state
interface TickerData {
  s: string; // Symbol, e.g., "BTCUSDT"
  c: string; // Current price as a string
  P: string; // Price change percentage as a string
}

interface PriceData {
  price: number; // Current price
  change: number; // Price change percentage
}

interface UseBinanceWebSocketResult {
  error: Error | null;
  reconnecting: boolean;
  orderBook?: OrderBook;
  buyPrices: PriceData | undefined;
  sellPrices: PriceData | undefined;
}
// Define types for the bids and asks data
type OrderBook = {
  lastUpdateId: number;
  bids: [string, string][]; // Array of tuples where each tuple contains a price and quantity as strings
  asks: [string, string][]; // Array of tuples where each tuple contains a price and quantity as strings
};

const useBinanceWebSocket = ({
  buySymbol,
  sellSymbol,
  bookFor,
}: {
  buySymbol?: string;
  sellSymbol?: string;
  bookFor?: string;
}): UseBinanceWebSocketResult => {
  const [buyPrices, setBuyPrices] = useState<PriceData>();
  const [sellPrices, setSellPrices] = useState<PriceData>();
  const [orderBook, setOrderBook] = useState<OrderBook>();
  const [error, setError] = useState<Error | null>(null);
  const [reconnecting, setReconnecting] = useState(false);
  const buyWS = useRef<WebSocket | null>(null);
  const sellWS = useRef<WebSocket | null>(null);
  // Throttle function to limit updates to 1 second
  const throttledUpdate = throttle((data: TickerData, type: string) => {
    // eslint-disable-next-line
    if (type === "buy") {
      setBuyPrices({
        price: typeof data?.c === "string" ? parseFloat(data.c) : data.c,
        change: typeof data?.P === "string" ? parseFloat(data.P) : data.P,
      });
    } else {
      setSellPrices({
        price: typeof data?.c === "string" ? parseFloat(data.c) : data.c,
        change: typeof data?.P === "string" ? parseFloat(data.P) : data.P,
      });
    }
  }, 1000);

  // Throttle function to limit updates to 1 second
  const throttledUpdateBook = throttle((data) => {
    setOrderBook(data);
  }, 1000); // Throttle for 5 second

  // Create WebSocket connection for each symbol
  const createWebSocket = useCallback((symbol: string, type: string) => {
    const wsUrl = `${BINANCE_WS_URL}${symbol.toLowerCase()}usdt@ticker_1h`;
    const orderBookWsUrl = `${BINANCE_WS_URL}${symbol.toLowerCase()}usdt@depth`;

    const ws = new WebSocket(wsUrl);
    const orderBookWs = new WebSocket(orderBookWsUrl);

    ws.onopen = (event) => {
      console.log("connected to websocket", symbol, event);
    };
    // WebSocket event handlers
    ws.onmessage = (event) => {
      try {
        const data: TickerData = JSON.parse(event.data);
        // Call throttled function to update state
        throttledUpdate(data, type);
      } catch (err) {
        console.error("Error parsing WebSocket message", err, event);
        setError(new Error("Error parsing WebSocket message"));
      }
    };
    orderBookWs.onmessage = (event) => {
      try {
        const data: TickerData = JSON.parse(event.data);
        // Call throttled function to update state
        throttledUpdateBook(data);
      } catch (err) {
        console.error("Error parsing WebSocket message", err);
        setError(new Error("Error parsing WebSocket message"));
      }
    };

    ws.onerror = (event) => {
      JSON.stringify(event, ["message", "arguments", "type", "name"]);
      setError(new Error("WebSocket error"));
    };

    ws.onclose = () => {
      // Attempt to reconnect if WebSocket is closed unexpectedly
      setReconnecting(true);
      setTimeout(() => {
        createWebSocket(symbol, type);
        setReconnecting(false);
      }, 5000); // Reconnect after 5 seconds
    };

    return ws;
  }, []);

  const createWebSocketBook = useCallback((symbol: string) => {
    const orderBookWsUrl = `${BINANCE_WS_URL}${symbol.toLowerCase()}usdt@depth5`;

    const orderBookWs = new WebSocket(orderBookWsUrl);
    orderBookWs.onmessage = (event) => {
      try {
        const data: TickerData = JSON.parse(event.data);
        // Call throttled function to update state
        throttledUpdateBook(data);
      } catch (err) {
        console.error("Error parsing WebSocket message", err);
        setError(new Error("Error parsing WebSocket message"));
      }
    };

    return orderBookWs;
  }, []);

  useEffect(() => {
    // Close the previous WebSocket before creating a new one
    if (buyWS.current) {
      buyWS.current.close();
    }
    // Create a new WebSocket if buySymbol is defined
    if (buySymbol) {
      buyWS.current = createWebSocket(buySymbol, "buy");
    }
    return () => {
      // Ensure the WebSocket is closed when the component unmounts
      if (buyWS.current) {
        buyWS.current.close();
      }
    };
  }, [buySymbol]);

  useEffect(() => {
    // Close the previous WebSocket before creating a new one
    if (sellWS.current) {
      sellWS.current.close();
    }

    // Create a new WebSocket if buySymbol is defined
    if (sellSymbol) {
      sellWS.current = createWebSocket(sellSymbol, "sell");
    }

    return () => {
      // Ensure the WebSocket is closed when the component unmounts
      if (sellWS.current) {
        sellWS.current.close();
      }
    };
  }, [sellSymbol]);

  useEffect(() => {
    if (!bookFor) return;
    const ws = createWebSocketBook(bookFor);

    return () => ws?.close();
  }, [bookFor]);

  return {
    buyPrices,
    sellPrices,
    error,
    orderBook,
    reconnecting,
  };
};

export default useBinanceWebSocket;
