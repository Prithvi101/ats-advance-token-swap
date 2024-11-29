"use client";
import React, { useState, useEffect } from "react";
import CryptoInput, { Token } from "../Inputs/CryptoInput";
import useGetAllSymbols from "@/hooks/useGetAllSymbol";
import ListItemCard from "./ListItemCard";
import Button from "../Buttons/Button";
import useBinanceWebSocket from "@/hooks/useBinanceWebSocket"; // Import the WebSocket hook
import { FaArrowDown } from "react-icons/fa";
import TokenSelector from "../Modal/TokenSelector";
import MultiAlert from "../Modal/MultiAlert";

function SwapCard() {
  const [buy, setBuy] = useState<number>(0);
  const [sell, setSell] = useState<number>(0);
  const { symbols } = useGetAllSymbols();
  const [transactionComplete, setTransactionComplete] = useState(false); // State to manage transaction status
  const [buyToken, setBuyToken] = useState<Token>({
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image:
      "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
  });
  const [sellToken, setSellToken] = useState<Token>({
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image:
      "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628",
  });
  const [selectionPopup, setSelectionPopup] = useState<boolean>(false);
  const [fees, setFees] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [transactionProcessing, setTransactionProcessiing] =
    useState<boolean>(false);
  const [currentSelection, setCurrentSelection] = useState<"buy" | "sell">(
    "buy"
  );

  const { buyPrices, loading: buyLoading } = useBinanceWebSocket({
    buySymbol: buyToken.symbol,
  });
  const { sellPrices, loading: sellLoading } = useBinanceWebSocket({
    sellSymbol: sellToken.symbol,
  });
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
      if (sellToken && buyToken && sellPrices && buyPrices) {
        const totalAmount = sellPrices?.price * sell;

        const buyableSellToken = totalAmount / buyPrices?.price;

        setBuy(parseFloat(calculateFees(buyableSellToken).toFixed(2)));
        setCurrentSelection("sell");
      }
    } else if (currentSelection === "buy" || (buy > 0 && sell == 0)) {
      // Check if sellToken and buyToken are defined and prices are available
      if (sellToken && buyToken && sellPrices && buyPrices) {
        const amountRequired = (buyPrices?.price * buy) / sellPrices?.price;
        setSell(parseFloat(calculateFees(amountRequired).toFixed(2)));
        setCurrentSelection("buy");
      }
    }
  }, [sell, buy, sellToken, buyToken]);
  useEffect(() => {
    if (!showAlert) setTransactionComplete(false);
  }, [showAlert]);
  const handleSelectToken = (symbol: Token) => {
    console.log(symbol);
    if (currentSelection === "buy") {
      setBuyToken(symbol);
    } else {
      setSellToken(symbol);
    }
    setSelectionPopup(false);
  };
  const handleConfirm = () => {
    // Simulate transaction success
    setTransactionComplete(true);
    setTransactionProcessiing(true);
    // Optionally hide the alert after a delay
    setTimeout(() => {
      setTransactionProcessiing(false);
    }, 2000);
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
    const price = buyPrices?.price;
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
        "bg-slate-600/10 flex-col h-auto max-w-[480px] m-auto animate-slide-up rounded-3xl flex justify-start p-4 gap-2 " +
        (error ? "border-2 border-red-500/50 rounded-3xl p-2" : "")
      }
    >
      {/* CryptoInput for Sell */}
      <div className="relative flex flex-col gap-2">
        <CryptoInput
          value={sell}
          label={"Sell"}
          loading={sellLoading}
          currentPrice={sellPrices?.price ?? 0}
          change={sellPrices?.change ?? 0}
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
          loading={buyLoading}
          currentPrice={buyPrices?.price ?? 0}
          setValue={setBuy}
          setCurrentSelection={() => {
            setCurrentSelection("buy");
            if (!buyToken) {
              setSelectionPopup(true);
            }
          }}
          change={buyPrices?.change || 0}
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
          {!transactionComplete ? (
            <>
              <div className="flex justify-between items-center">
                <ListItemCard symbol={sellToken}></ListItemCard>
                <div className="text-sm font-bold flex flex-col items-end">
                  <p className="text-white/25">Expected Tokens</p>
                  <p>{sell}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <ListItemCard symbol={buyToken}></ListItemCard>
                <div className="text-sm font-bold flex flex-col items-end">
                  <p className="text-white/25">Expected Tokens</p>
                  <p>{buy}</p>
                </div>
              </div>
              <div className="flex justify-between font-semibold text-sm border-t-2 border-white/25 pt-4 mt-2">
                <p className="text-white/25">Amount Before Fees</p>
                <p>{buy && buy?.toFixed(2)} $</p>
              </div>
              <div className="flex justify-between font-semibold text-sm">
                <p className="text-white/25">Amount With Fees</p>
                <p>{(buy + fees)?.toFixed(2)} $</p>
              </div>
              <div className="flex gap-2 justify-between text-sm font-bold text-white/25">
                <p>Max Slippage</p>
                <p className={fees > 0 ? "text-white" : ""}>1%</p>
              </div>
              <Button
                onClick={handleConfirm}
                label="CONFIRM"
                className="justify-center mt-4"
              />
            </>
          ) : transactionProcessing ? (
            <div className="flex items-center justify-center p-20">
              <div className="lds-circle flex items-center justify-center animate-bounce ">
                <div className="text-2xl font-bold">B</div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl font-bold text-green-500">
                Transaction Successful
              </p>
              <p className="text-sm text-white/50 mt-2">
                Your transaction has been successfully processed.
              </p>
              <Button
                onClick={() => {
                  setTransactionComplete(false);
                  setShowAlert(false);
                }}
                label="CLOSE"
                className="justify-center mt-4"
              />
            </div>
          )}
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
