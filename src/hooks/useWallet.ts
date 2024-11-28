import { useState, useEffect } from "react";
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
  const [error, setError] = useState<boolean>(false);
  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      setError(true);
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
      setError(false);
      // eslint-disable-next-line
    } catch (err: any) {
      setError(true);
      setWallet((prev) => ({
        ...prev,
        error: err.message || "Failed to connect wallet.",
      }));
    }
  };

  const disconnectWallet = async () => {
    console.log("wallet disconnected");
    await window.ethereum.request({
      method: "wallet_revokePermissions",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
    setWallet({ walletAddress: null, provider: null, error: null });
    // Inform the user to manually disconnect if necessary
  };

  // Sync state with MetaMask events
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setWallet((prev) => ({ ...prev, walletAddress: accounts[0] }));
      }
    };

    const handleDisconnect = () => {
      disconnectWallet();
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("disconnect", handleDisconnect);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("disconnect", handleDisconnect);
      }
    };
  }, []);

  return { error, wallet, connectWallet, disconnectWallet };
};
