import { ethers } from "ethers";

interface WalletConnection {
  provider: ethers.providers.Web3Provider;
  signer: ethers.Signer;
  walletAddress: string;
}

export const connectWallet = async (): Promise<WalletConnection | null> => {
  if (typeof window.ethereum !== "undefined") {
    try {
      // Request MetaMask connection
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();

      return { provider, signer, walletAddress };
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      return null;
    }
  } else {
    alert("MetaMask is not installed. Please install it to use this feature.");
    return null;
  }
};
