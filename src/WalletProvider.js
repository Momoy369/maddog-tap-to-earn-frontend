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
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  console.log("Rendering WalletProviderComponent...");

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
          <WalletHandler /> {/* Pastikan WalletHandler dipanggil di sini */}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const WalletHandler = () => {
  const wallet = useWallet();
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    if (wallet?.publicKey) {
      console.log("Wallet Connected:", wallet.publicKey.toBase58());
      setIsWalletConnected(true);

      axios
        .post("https://maddog-token.site/user/save-wallet", {
          walletAddress: wallet.publicKey.toBase58(),
        })
        .then((response) => console.log("Wallet saved:", response.data))
        .catch((error) => console.error("Error saving wallet:", error));
    }
  }, [wallet]);

  const handleWalletButtonClick = () => {
    if (publicKey) {
      const walletAddress = publicKey.toBase58();

      if (/android/i.test(navigator.userAgent)) {
        // Jika di Android, pakai Intent URL
        window.location.href = `intent://wallet/${walletAddress}#Intent;scheme=phantom;package=app.phantom;end;`;
      } else {
        // Jika di iOS atau browser biasa, pakai deep link biasa
        window.location.href = `phantom://wallet/${walletAddress}`;
      }
    }
  };

  return (
    <>
      <WalletMultiButton onClick={handleWalletButtonClick} />
    </>
  );
};
