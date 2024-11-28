"use client";

import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
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
  change: string; // Price change percentage
}

interface UseBinanceWebSocketResult {
  prices: Record<string, PriceData>;
  error: Error | null;
  reconnecting: boolean;
  setUpdateTokens: Dispatch<SetStateAction<boolean>>;
}

const useBinanceWebSocket = (symbols: string[]): UseBinanceWebSocketResult => {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [error, setError] = useState<Error | null>(null);
  const [reconnecting, setReconnecting] = useState(false);
  const [updateTokens, setUpdateTokens] = useState(false);
  const wsConnections: Record<string, WebSocket>[] = [];
  // Throttle function to limit updates to 1 second
  const throttledUpdate = useCallback(
    throttle((data: TickerData, symbol: string) => {
      setPrices((prevPrices) => ({
        ...prevPrices,
        [symbol]: {
          price: data?.c,
          change: data?.P,
        },
      }));
    }, 1000), // Throttle for 5 second
    []
  );

  const disconnectUnusedWs = () => {
    // Flatten the array and iterate over each WebSocket connection
    wsConnections.flatMap(Object.entries).forEach(([symbol, ws]) => {
      // close  each unneeded WebSocket
      if (!symbols.includes(symbol)) {
        ws?.close?.();
      }
    });
  };

  // Create WebSocket connection for each symbol
  const createWebSocket = useCallback((symbol: string) => {
    const wsUrl = `${BINANCE_WS_URL}${symbol.toLowerCase()}usdt@ticker_1h`;
    console.log(wsUrl);
    const ws = new WebSocket(wsUrl);

    // WebSocket event handlers
    ws.onmessage = (event) => {
      try {
        const data: TickerData = JSON.parse(event.data);
        // Call throttled function to update state
        throttledUpdate(data, symbol);
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
        createWebSocket(symbol);
        setReconnecting(false);
      }, 5000); // Reconnect after 5 seconds
    };

    return ws;
  }, []);

  useEffect(() => {
    if (symbols.length === 0) return;
    if (updateTokens) {
      // Establish WebSocket connections for each symbol
      symbols.forEach((symbol) => {
        const ws = createWebSocket(symbol);
        wsConnections.push({ [symbol]: ws });
      });
      setUpdateTokens(false);
    }
    disconnectUnusedWs();

    // Cleanup all WebSocket connections when the component unmounts or symbols change
    return () => {
      wsConnections.forEach((ws) => ws.close?.());
    };
  }, [updateTokens]); // Re-run when symbols change or createWebSocket function is updated

  return { prices, error, reconnecting, setUpdateTokens };
};

export default useBinanceWebSocket;
