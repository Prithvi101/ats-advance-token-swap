import React from "react";
import Image from "next/image";
import { Token } from "../Inputs/CryptoInput"; // Assuming Token is imported from here

interface ListItemCardProps {
  symbol: Token; // Ensure Token is the correct type imported from the relevant module
  handleSelectToken: (token: Token) => void; // Ensure handleSelectToken receives the correct argument type
}

function ListItemCard({ symbol, handleSelectToken }: ListItemCardProps) {
  return (
    <div
      key={symbol?.id}
      className="cursor-pointer hover:bg-gray-600 p-2 flex justify-start gap-2 px-4"
      onClick={() => handleSelectToken(symbol)}
    >
      <Image
        src={symbol?.image}
        alt={symbol?.id || "token-image"}
        width={25}
        height={25}
        className="rounded-full w-12 h-auto"
      />
      <div className="flex flex-col">
        <p className="font-bold"> {symbol?.name}</p>
        <p> {symbol?.symbol.toUpperCase()}</p>
      </div>
    </div>
  );
}

export default ListItemCard;
