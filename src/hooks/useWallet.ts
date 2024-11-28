import { useState } from "react";
import { ethers } from "ethers";

interface WalletState {
  walletAddress: string | null;
  provider: ethers.providers.Web3Provider | null;
  error: string | null;
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    walletAddress: null,
    provider: null,
    error: null,
  });

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      setWallet((prev) => ({ ...prev, error: "MetaMask is not installed." }));
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWallet({
        walletAddress: accounts[0],
        provider,
        error: null,
      });
    } catch (err: any) {
      setWallet((prev) => ({
        ...prev,
        error: err.message || "Failed to connect wallet.",
      }));
    }
  };

  const disconnectWallet = () => {
    setWallet({ walletAddress: null, provider: null, error: null });
  };

  return { wallet, connectWallet, disconnectWallet };
};
