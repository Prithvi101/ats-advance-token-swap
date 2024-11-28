import binanceClient from "../lib/binanceClient";

export const fetchBinanceSymbols = async () => {
  const response = await binanceClient.get("/exchangeInfo");
  return response.data.symbols.map(
    (pair: { symbol: string; baseAsset: string; quoteAsset: string }) => ({
      symbol: pair.symbol,
      baseAsset: pair.baseAsset,
      quoteAsset: pair.quoteAsset,
    })
  );
};
