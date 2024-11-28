"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import SearchInput from "../Inputs/SearchInput";
import { Token } from "../Inputs/CryptoInput";
import ListItemCard from "../Cards/ListItemCard";

interface TokenSelectorProps {
  selectionPopup: boolean;
  setSelectionPopup: Dispatch<SetStateAction<boolean>>;
  symbols: Token[];
  currentSelection: string;
  sellToken: Token | undefined;
  buyToken: Token | undefined;
  handleSelectToken: () => void;
}

function TokenSelector({
  selectionPopup,
  setSelectionPopup,
  symbols,
  sellToken,
  buyToken,
  currentSelection,
  handleSelectToken,
}: TokenSelectorProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter symbols based on search query
  const filteredSymbols = symbols?.filter?.(
    (symbol) =>
      symbol.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (currentSelection == "buy" //checking if opposite symbol is already selected if yes then remove it
        ? symbol.symbol.toLocaleLowerCase() != sellToken?.symbol
        : symbol.symbol.toLocaleLowerCase() != buyToken?.symbol)
  );

  return selectionPopup ? (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center animate-fadeIn">
      <div className="bg-select rounded-3xl max-h-[80%] w-full h-full overflow-hidden max-w-80 text-white animate-modalOpen border-white/10 border-2">
        <div className="flex justify-between items-center mb-4 px-6 pt-6">
          <h3 className="text-xl font-bold ">Select a token</h3>
          {/* Close Button */}
          <div onClick={() => setSelectionPopup(false)}>
            <RxCross1 />
          </div>
        </div>
        {/* Search Input */}
        <div className="px-4">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
        <div className="overflow-y-auto h-full w-full  scrollbar-custom">
          {/* Symbol List */}
          {filteredSymbols && filteredSymbols.length > 0 ? (
            <div>
              {filteredSymbols.map((symbol) => (
                <ListItemCard
                  key={symbol.id}
                  symbol={symbol}
                  handleSelectToken={handleSelectToken}
                />
              ))}
            </div>
          ) : (
            <p>No symbols available.</p>
          )}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default TokenSelector;
