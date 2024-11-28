"use client";
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
    <div className="max-w-7xl m-auto px-8 mt-5">
      <div className="  flex  justify-center items-center flex-col-reverse sm:flex-row">
        <div className="">
          <div className="bg-select p-2 border-deselect border-2 rounded-2xl">
            <ListItemCard symbol={Token}></ListItemCard>
          </div>
        </div>
        <div className="max-w-[480px] flex-grow m-auto">
          <SearchInput onClick={() => setSelectionPopup(true)}></SearchInput>
        </div>
      </div>
      {/* Popup Modal */}
      <TokenSelector
        selectionPopup={selectionPopup}
        setSelectionPopup={setSelectionPopup}
        symbols={symbols}
        handleSelectToken={handleSelectToken}
      ></TokenSelector>

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
