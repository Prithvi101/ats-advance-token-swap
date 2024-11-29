"use client";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { TiArrowSortedDown } from "react-icons/ti";

interface CryptoInputParams {
  value?: number;
  setValue: Dispatch<SetStateAction<number>>;
  setCurrentSelection: () => void;
  token: Token | undefined;
  onClickSymbol: () => void;
  currentPrice: number;
  label: string;
  change?: number;
  loading?: boolean;
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
  loading,
}: CryptoInputParams) => {
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(e.target.value));
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
              value={isNaN(value ?? 0) ? "" : value}
              onChange={handleValueChange}
              className=" bg-transparent w-full text-2xl font-bold outline-none"
              placeholder="0"
            />
          </div>
        </div>
        <div className="flex items-center   justify-center flex-col ">
          <div
            onClick={onClickSymbol}
            className=" bg-select border-slate-600/50 border-2 whitespace-nowrap px-2 relative py-1 cursor-pointer  font-extrabold  rounded-full flex items-center gap-1"
          >
            {token?.image ? (
              <>
                <Image
                  src={token?.image}
                  width={30}
                  height={30}
                  alt={token?.symbol}
                ></Image>
                <p className="">{token?.symbol?.toLocaleUpperCase()}</p>
                <TiArrowSortedDown className="text-lg  w-12" />
              </>
            ) : (
              <p>Select Token</p>
            )}
          </div>
          {/* Example rate conversion */}
        </div>
      </div>
      <div
        className={"mt-1 text-sm text-gray-400 flex justify-between min-h-4"}
      >
        <p className={" min-h-4 min-w-9 " + (loading ? "skeleton" : "")}>
          {currentPrice
            ? `${
                value === 0
                  ? `$${currentPrice}`
                  : value && currentPrice
                  ? `$${(value * currentPrice).toFixed(2)}`
                  : ""
              }`
            : ""}
        </p>
        <div
          className={
            "flex items-center gap-2 w-16 " + (loading ? "skeleton" : "")
          }
        >
          {change != 0 && (
            <>
              <p className="font-bold">1H</p>
              <p
                className={
                  "text-sm " + (change > 0 ? "text-green-500" : "text-red-500")
                }
              >
                {change?.toFixed(2) + "%"}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoInput;
