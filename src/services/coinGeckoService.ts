import { fallBackCoinData } from "@/database/Constants";
import axios from "axios";

export const fetchCoinGeckoSymbols = async () => {
  try {
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
    // eslint-disable-next-line
    return response.data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
    }));
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line
    return fallBackCoinData.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
    }));
  }
};
