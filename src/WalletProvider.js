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
          <WalletHandler />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const WalletHandler = () => {
  const { publicKey, wallet } = useWallet();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isWebView, setIsWebView] = useState(false);

  useEffect(() => {
    // Cek apakah aplikasi berjalan di Telegram WebView
    setIsWebView(window.Telegram?.WebApp !== undefined);

    if (publicKey) {
      console.log("Wallet Connected:", publicKey.toBase58());
      setIsWalletConnected(true);

      axios
        .post("https://maddog-token.site/user/save-wallet", {
          walletAddress: publicKey.toBase58(),
        })
        .then((response) => console.log("Wallet saved:", response.data))
        .catch((error) => console.error("Error saving wallet:", error));
    }
  }, [publicKey]);

  const handleWalletButtonClick = () => {
    if (isWebView && publicKey) {
      // Buka dompet via deep link jika di Telegram WebView
      window.location.href = `phantom://wallet/${publicKey.toBase58()}`;
    }
  };

  return (
    <>
      {isWebView ? (
        <button
          onClick={handleWalletButtonClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          🔗 Buka Wallet di Phantom
        </button>
      ) : (
        <WalletMultiButton />
      )}
    </>
  );
};