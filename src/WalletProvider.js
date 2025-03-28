import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

require("@solana/wallet-adapter-react-ui/styles.css");

export const WalletProviderComponent = ({ children }) => {
  const network = "mainnet-beta";
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter({ deepLink: true }),
      new SolflareWalletAdapter({ deepLink: true }),
    ],
    []
  );

  console.log("Rendering WalletProviderComponent...");

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}

          {/* WalletMultiButton harus berada dalam WalletModalProvider */}
          <WalletButtonHandler />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const WalletButtonHandler = () => {
  const { publicKey } = useWallet();

  const handleWalletButtonClick = () => {
    if (publicKey) {
      const walletAddress = publicKey.toBase58();

      if (/android/i.test(navigator.userAgent)) {
        window.location.href = `intent://wallet/${walletAddress}#Intent;scheme=phantom;package=app.phantom;end;`;
      } else {
        window.location.href = `phantom://wallet/${walletAddress}`;
      }
    }
  };

  return <WalletMultiButton onClick={handleWalletButtonClick} />;
};
