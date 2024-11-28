"use client";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";

interface CryptoInputParams {
  value?: number;
  setValue: Dispatch<SetStateAction<number>>;
  setCurrentSelection: () => void;
  token: Token | undefined;
  onClickSymbol: () => void;
  currentPrice: number;
  label: string;
  change?: number;
}
export interface Token {
  id?: string;
  image: string;
  symbol: string;
  name?: string;
}

const CryptoInput = ({
  value,
  setValue,
  token,
  onClickSymbol,
  setCurrentSelection,
  currentPrice,
  change,
  label,
}: CryptoInputParams) => {
  const handleValueChange = (e) => {
    setValue(e.target.value);
  };
  useEffect(() => {}, [currentPrice]);
  return (
    <div
      onClick={() => setCurrentSelection()}
      className={
        " bg-deselect hover:bg-deselect/20 focus-within:bg-select  text-white rounded-3xl p-4 border flex flex-col border-gray-700/25 justify-between "
      }
    >
      <div className="flex">
        <div className="flex flex-col  ">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{label}</span>
          </div>
          <div className="flex items-center mt-2">
            <input
              type="number"
              value={value || ""}
              onChange={handleValueChange}
              className=" bg-transparent w-full text-2xl font-bold outline-none"
              placeholder="0"
            />
          </div>
        </div>
        <div className="flex items-center   justify-center flex-col ">
          <div
            onClick={onClickSymbol}
            className=" bg-select border-slate-600/50 border-2 whitespace-nowrap px-2 relative py-1 cursor-pointer  font-extrabold rounded-full flex items-center gap-1"
          >
            {token?.image ? (
              <>
                <Image
                  src={token?.image}
                  width={30}
                  height={30}
                  alt={token?.symbol}
                  className="h-full rounded-full"
                ></Image>
                <p className="">{token?.symbol?.toLocaleUpperCase()}</p>
              </>
            ) : (
              <p>Select Token</p>
            )}

            <IoIosArrowDown />
          </div>
          {/* Example rate conversion */}
        </div>
      </div>
      <div className="mt-1 text-sm text-gray-400 flex justify-between">
        ${value && currentPrice ? (value * currentPrice).toFixed(2) : ""}{" "}
        {change && (
          <div className="flex items-center gap-2 ">
            <p className="font-bold">1H</p>
            <p
              className={
                "text-sm " + (change > 0 ? "text-green-500" : "text-red-500")
              }
            >
              {parseFloat(change)?.toFixed(2) + "%"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoInput;
