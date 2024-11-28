"use client";
import OrderBook from "@/components/orderbook/Orderbook";
import ListItemCard from "@/components/Ui/Cards/ListItemCard";
import { Token } from "@/components/Ui/Inputs/CryptoInput";
import SearchInput from "@/components/Ui/Inputs/SearchInput";
import TokenSelector from "@/components/Ui/Modal/TokenSelector";
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
    <div className="max-w-7xl m-auto px-8 mt-5">
      <div className="max-w-[480px] m-auto">
        <SearchInput onClick={() => setSelectionPopup(true)}></SearchInput>
      </div>
      {/* Popup Modal */}
      <TokenSelector
        selectionPopup={selectionPopup}
        setSelectionPopup={setSelectionPopup}
        symbols={symbols}
        handleSelectToken={handleSelectToken}
      ></TokenSelector>
      <div className="flex items-center justify-center sm:justify-start">
        <div className="bg-select p-2 border-deselect border-2 rounded-2xl">
          <ListItemCard symbol={Token}></ListItemCard>
        </div>
      </div>
      <OrderBook symbol={Token?.symbol}></OrderBook>

      {/* Bokeh Effect for bacground */}
      <div className="absolute -z-20 inset-0 animate-bokeh">
        <div className="absolute bg-green-400 opacity-20 blur-2xl rounded-full w-36 h-36 top-20 left-10 animate-pulse"></div>
        <div className="absolute bg-green-500 opacity-25 blur-3xl rounded-full w-48 h-48 top-40 left-48"></div>
        <div className="absolute bg-green-300 opacity-15 blur-2xl rounded-full w-64 h-64 bottom-24 right-16"></div>
        <div className="absolute bg-green-600 opacity-10 blur-3xl rounded-full w-52 h-52 top-10 animate-pulse right-32"></div>
      </div>
    </div>
  );
}

export default Page;
