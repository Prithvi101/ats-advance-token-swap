"use client";
import Image from "next/image";
import React from "react";
import { IoIosArrowDown } from "react-icons/io";

interface CryptoInputParams {
  value: number;
  setValue: (item: number) => void;
  token: { image: string; symbol: string };
  onClickSymbol: () => void;
  isSelected: boolean;
}

const CryptoInput = ({
  value,
  setValue,
  token,
  onClickSymbol,
  isSelected,
}: CryptoInputParams) => {
  const handleValueChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div
      className={
        "w-full max-w-sm bg-deselect hover:bg-deselect/20 focus-within:bg-select  text-white rounded-3xl p-4 border flex border-gray-700/25 "
      }
    >
      <div className="flex flex-col  w-[70%]">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Sell</span>
        </div>
        <div className="flex items-center mt-2">
          <input
            type="number"
            value={value}
            onChange={handleValueChange}
            className="flex-1 bg-transparent text-2xl font-bold outline-none"
            placeholder="0"
          />
        </div>
        <div className="mt-1 text-sm text-gray-400">
          ${(value * 2000).toFixed(2)} {/* Example rate conversion */}
        </div>
      </div>
      <div className="flex items-center  w-[30%] justify-center">
        <div
          onClick={onClickSymbol}
          className=" bg-select border-slate-600/50 border-2 relative py-1 cursor-pointer px-1 font-extrabold rounded-full flex items-center gap-1"
        >
          <Image
            src={token?.image}
            width={30}
            height={30}
            alt={token?.symbol}
            className="h-full"
          ></Image>
          <p>{token?.symbol}</p>
          <IoIosArrowDown />
        </div>
      </div>
    </div>
  );
};

export default CryptoInput;
