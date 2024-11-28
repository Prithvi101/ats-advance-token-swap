"use client";
import React, { useState, useEffect } from "react";
import CryptoInput, { Token } from "../Inputs/CryptoInput";
import useGetAllSymbols from "@/hooks/useGetAllSymbol";
import SearchInput from "../Inputs/SearchInput";
import ListItemCard from "./ListItemCard";
import Button from "../Buttons/Button";
import useBinanceWebSocket from "@/hooks/useBinanceWebSocket"; // Import the WebSocket hook
import { FaArrowDown } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import TokenSelector from "../Modal/TokenSelector";
import MultiAlert from "../Modal/MultiAlert";

function SwapCard() {
  const [buy, setBuy] = useState<number>(0);
  const [sell, setSell] = useState<number>(0);
  const { symbols } = useGetAllSymbols();
  const [buyToken, setBuyToken] = useState<Token | undefined>(undefined);
  const [sellToken, setSellToken] = useState<Token | undefined>(undefined);
  const [selectionPopup, setSelectionPopup] = useState<boolean>(false);
  const [fees, setFees] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentSelection, setCurrentSelection] = useState<"buy" | "sell">(
    "buy"
  );

  const { prices, setUpdateTokens } = useBinanceWebSocket([
    ...(buyToken ? [buyToken.symbol] : []),
    ...(sellToken ? [sellToken.symbol] : []),
  ]);
  const handleSwitch = () => {
    setBuy((prevBuy) => {
      setSell(prevBuy);
      return sell;
    });

    setBuyToken((prevBuyToken) => {
      setSellToken(prevBuyToken);
      return sellToken;
    });
  };

  useEffect(() => {
    if (error) setTimeout(() => setError(""), 1000);
  }, [error]);

  useEffect(() => {
    if (currentSelection === "sell" || (sell > 0 && buy == 0)) {
      // Check if sellToken and buyToken are defined and prices are available
      if (
        sellToken &&
        buyToken &&
        prices[sellToken.symbol] &&
        prices[buyToken.symbol]
      ) {
        const totalAmount = prices[sellToken.symbol]?.price * sell;

        const buyableSellToken = totalAmount / prices[buyToken.symbol]?.price;

        setBuy(parseFloat(calculateFees(buyableSellToken).toFixed(2)));
        setCurrentSelection("sell");
      }
    } else if (currentSelection === "buy" || (buy > 0 && sell == 0)) {
      // Check if sellToken and buyToken are defined and prices are available
      if (
        sellToken &&
        buyToken &&
        prices[sellToken.symbol] &&
        prices[buyToken.symbol]
      ) {
        const amountRequired =
          (prices[buyToken.symbol]?.price * buy) /
          prices[sellToken.symbol]?.price;
        setSell(parseFloat(calculateFees(amountRequired).toFixed(2)));
        setCurrentSelection("buy");
      }
    }
  }, [sell, prices, buy, sellToken, buyToken]);

  const handleSelectToken = (symbol: Token) => {
    console.log(symbol);
    if (currentSelection === "buy") {
      setBuyToken(symbol);
    } else {
      setSellToken(symbol);
    }
    setUpdateTokens(true);
    setSelectionPopup(false);
  };

  const handleSwap = () => {
    if (!buyToken || !sellToken) {
      setError("Please Select Token");
      return;
    }
    if (!buy || !sell) {
      setError("Please Enter Value");
      return;
    }
    // Trigger the swap action, including the use of the price data
    setShowAlert(true);
    const price = prices[buyToken?.symbol || ""]?.price;
    if (price) {
      const calculatedAmount = buy * price;
      console.log(`Calculated amount: ${calculatedAmount}`);
    }
  };

  const calculateFees = (amount: number) => {
    const amountAfterFees = amount - amount * 0.0025;
    const totalFees = parseFloat((amount - amountAfterFees).toFixed(2));
    setFees(totalFees);
    return amountAfterFees;
  };

  return (
    <div
      className={
        "bg-slate-600/10 flex-col h-auto max-w-[480px]  rounded-3xl flex justify-start p-4 gap-2 " +
        (error ? "border-2 border-red-500/50 rounded-3xl p-2" : "")
      }
    >
      {/* CryptoInput for Sell */}
      <div className="relative flex flex-col gap-2">
        <CryptoInput
          value={sell}
          label={"Sell"}
          currentPrice={
            sellToken?.symbol ? prices?.[sellToken?.symbol]?.price : 0
          }
          change={sellToken?.symbol ? prices?.[sellToken?.symbol]?.change : 0}
          token={sellToken}
          setValue={setSell}
          setCurrentSelection={() => {
            setCurrentSelection("sell");
            if (!sellToken) {
              setSelectionPopup(true);
            }
          }}
          onClickSymbol={() => {
            setCurrentSelection("sell");
            setSelectionPopup(true);
          }}
        />
        {/* CryptoInput for Buy */}
        <CryptoInput
          value={buy}
          label={"Buy"}
          currentPrice={
            buyToken?.symbol ? prices?.[buyToken?.symbol]?.price : 0
          }
          setValue={setBuy}
          setCurrentSelection={() => {
            setCurrentSelection("buy");
            if (!buyToken) {
              setSelectionPopup(true);
            }
          }}
          change={buyToken?.symbol ? prices?.[buyToken?.symbol]?.change : 0}
          token={buyToken}
          onClickSymbol={() => {
            setCurrentSelection("buy");
            setSelectionPopup(true);
          }}
        />
        <Button
          onClick={handleSwitch}
          label=""
          Icon={FaArrowDown}
          className="items-center justify-center px-4 py-2 rounded-2xl hover:scale-100  flex-wrap absolute top-0 bottom-0 left-0 right-0 m-auto w-12 aspect-square border-white/15 border-2 bg-select text-white"
        />
      </div>
      {/* Popup Modal */}
      <TokenSelector
        selectionPopup={selectionPopup}
        setSelectionPopup={setSelectionPopup}
        buyToken={buyToken}
        sellToken={sellToken}
        symbols={symbols}
        currentSelection={currentSelection}
        handleSelectToken={handleSelectToken}
      ></TokenSelector>

      <MultiAlert show={showAlert} setShow={setShowAlert} label="Order Details">
        <div className="px-4">
          <div className=" flex  justify-between items-center">
            <ListItemCard symbol={sellToken}></ListItemCard>
            <div className="text-sm font-bold flex flex-col items-end">
              <p className=" text-white/25">Expected Tokens</p>
              <p>{sell}</p>
            </div>
          </div>
          <div className=" flex  justify-between items-center">
            <ListItemCard symbol={buyToken}></ListItemCard>
            <div className="text-sm font-bold flex flex-col items-end">
              <p className=" text-white/25">Expected Tokens</p>
              <p>{buy}</p>
            </div>
          </div>
          <div className="flex justify-between font-semibold text-sm border-t-2 border-white/25 pt-4 mt-2">
            <p className=" text-white/25">Amount Before Fees</p>
            <p> {buy.toFixed(2)} $</p>
          </div>
          <div className="flex justify-between font-semibold text-sm">
            <p className=" text-white/25">Amount With Fees</p>
            <p>{(buy + fees).toFixed(2)} $</p>
          </div>
          <div className="flex gap-2 justify-between  text-sm font-bold text-white/25 ">
            <p>Max Slipage </p>
            <p className={fees > 0 ? "text-white" : ""}>1%</p>
          </div>
          <Button label="CONFIRM" className="justify-center mt-4"></Button>
        </div>
      </MultiAlert>

      <div>
        <Button
          onClick={handleSwap}
          label="SWAP"
          className="items-center justify-center px-4 py-2 rounded-2xl hover:scale-100 mt-2 font-bold"
        />
      </div>
      <div className="flex gap-2 justify-between px-4 text-sm font-bold text-white/25 mt-4">
        <p>Fee (0.25%)</p>
        <p className={fees > 0 ? "text-white" : ""}>${fees}</p>
      </div>
      <div className="flex gap-2 justify-between px-4 text-sm font-bold text-white/25 ">
        <p>Max Slipage </p>
        <p className={fees > 0 ? "text-white" : ""}>1%</p>
      </div>

      <p className="text-red-500 text-lg">{error}</p>
    </div>
  );
}

export default SwapCard;
