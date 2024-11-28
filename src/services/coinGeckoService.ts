/* eslint-disable */
import { fallBackCoinData } from "@/database/Constants";
import axios from "axios";

// Fetch Binance symbols (active trading pairs)
const fetchBinanceSymbols = async () => {
  try {
    const response = await axios.get(
      "https://api.binance.com/api/v3/exchangeInfo"
    );
    const symbols = response.data.symbols;

    // Filter out active trading pairs and return only the symbols (e.g., "BTCUSDT", "ETHUSDT")
    const binanceSymbols = symbols
      .filter((symbol: any) => symbol.status === "TRADING")
      .map((symbol: any) => symbol.symbol);

    return binanceSymbols;
  } catch (error) {
    console.error("Error fetching Binance symbols:", error);
    return [];
  }
};

// Fetch CoinGecko symbols
export const fetchCoinGeckoSymbols = async () => {
  try {
    const binanceSymbols = await fetchBinanceSymbols();

    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd", // Replace "usd" with your preferred currency if needed
          order: "market_cap_desc",
          per_page: 100, // Number of coins to fetch per page
          page: 1, // Page number
          sparkline: false,
        },
      }
    );

    const commonSymbols = response.data
      .filter((coin: any) => {
        // Check if Binance has a trading pair with the CoinGecko base symbol
        return binanceSymbols.some((binanceSymbol: string) =>
          binanceSymbol.includes(coin.symbol.toUpperCase())
        );
      })
      .map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
      }));

    return commonSymbols;
  } catch (error) {
    console.error("Error fetching CoinGecko symbols:", error);
    // Return fallback data if an error occurs
    return fallBackCoinData.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
    }));
  }
};
