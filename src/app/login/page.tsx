"use client";
import useBinanceSymbols from "@/hooks/useGetAllSymbol";
import React from "react";

const Page = () => {
  const { symbols, error } = useBinanceSymbols();

  if (error) return <div>Error loading Binance symbols: {error}</div>;

  return (
    <div>
      <h1>Binance Symbols</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
        }}
      >
        {symbols.map((symbol) => (
          <p key={symbol.symbol}>{symbol.symbol}</p>
        ))}
      </div>
    </div>
  );
};

export default Page;
