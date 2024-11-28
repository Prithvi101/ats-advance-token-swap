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

    return response.data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
    }));
  } catch (error) {
    throw new Error("Failed to fetch symbols from CoinGecko");
  }
};
