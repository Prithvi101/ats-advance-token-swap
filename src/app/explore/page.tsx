"use client";
import TradeViewChart from "@/components/chart/TradeViewChart";
import OrderBook from "@/components/orderbook/Orderbook";
import ListItemCard from "@/components/ui/Cards/ListItemCard";
import { Token } from "@/components/ui/Inputs/CryptoInput";
import SearchInput from "@/components/ui/Inputs/SearchInput";
import TokenSelector from "@/components/ui/Modal/TokenSelector";
import useGetAllSymbols from "@/hooks/useGetAllSymbol";
import React, { useState } from "react";

function Page() {
  const [selectionPopup, setSelectionPopup] = useState<boolean>(false);
  const [Token, setToken] = useState<Token>({
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image:
      "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
  });
  const { symbols } = useGetAllSymbols();
  const handleSelectToken = (symbol: Token) => {
    setToken(symbol);
    setSelectionPopup(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 mt-5  h-full flex flex-col gap-6 relative">
      {/* Header Section */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 sm:gap-6">
        {/* Token Display */}
        <div className="w-full sm:w-auto">
          <div className="p-3 border border-deselect rounded-2xl bg-black/65 shadow-lg hover:shadow-neon-green/25 transition-all">
            <ListItemCard disableHover symbol={Token}></ListItemCard>
          </div>
        </div>

        {/* Search Input */}
        <div className="w-full sm:max-w-[480px]">
          <SearchInput onClick={() => setSelectionPopup(true)}></SearchInput>
        </div>
      </div>

      {/* Token Selector Modal */}
      <TokenSelector
        selectionPopup={selectionPopup}
        setSelectionPopup={setSelectionPopup}
        symbols={symbols}
        handleSelectToken={handleSelectToken}
      ></TokenSelector>

      {/* Main Content Section */}
      <div className="flex flex-col md:flex-row gap-8 p-6 bg-black/55 rounded-2xl shadow-2xl relative h-full sm:h-auto">
        {/* Chart */}
        <div className="sm:flex-grow flex-1 ">
          <TradeViewChart chartSymbol={Token.symbol.toUpperCase()} />
        </div>

        {/* Order Book */}
        <div className="h-[10%] md:w-[30%]">
          <OrderBook symbol={Token.symbol}></OrderBook>
        </div>
      </div>

      {/* Animated Bokeh Circles */}
      <div className="absolute z-[-1] bg-neon-green opacity-20 blur-3xl rounded-full w-36 h-36 top-20 left-10 animate-pulse"></div>
      <div className="absolute z-[-1] bg-neon-blue opacity-25 blur-3xl rounded-full w-48 h-48 top-40 left-48"></div>
      <div className="absolute z-[-1] bg-neon-purple opacity-15 blur-2xl rounded-full w-64 h-64 bottom-24 right-16"></div>
      <div className="absolute z-[-1] bg-neon-orange opacity-10 blur-3xl rounded-full w-52 h-52 top-10 animate-pulse right-32"></div>
    </div>
  );
}

export default Page;
