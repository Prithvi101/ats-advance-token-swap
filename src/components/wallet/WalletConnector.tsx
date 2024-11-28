"use client";
import { useWallet } from "@/hooks/useWallet";
import React from "react";

const WalletConnector: React.FC = () => {
  const { wallet, connectWallet, disconnectWallet } = useWallet();

  return (
    <div>
      {wallet.walletAddress ? (
        <>
          <p>Connected: {wallet.walletAddress}</p>
          <button onClick={disconnectWallet}>Disconnect</button>
        </>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
      {wallet.error && <p style={{ color: "red" }}>{wallet.error}</p>}
    </div>
  );
};

export default WalletConnector;
