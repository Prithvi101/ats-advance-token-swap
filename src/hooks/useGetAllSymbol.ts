import { fetchCoinGeckoSymbols } from "@/services/coinGeckoService";
import { useEffect, useState } from "react";

export interface CoinGeckoSymbol {
  id: string;
  symbol: string;
  name: string;
  image: string;
}

const useGetAllSymbols = () => {
  const [symbols, setSymbols] = useState<CoinGeckoSymbol[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const result = await fetchCoinGeckoSymbols();
        setSymbols(result);
      } catch (err) {
        setError("Failed to fetch CoinGecko symbols");
      }
    };
    fetchSymbols();
  }, []);

  return { symbols, error };
};

export default useGetAllSymbols;
