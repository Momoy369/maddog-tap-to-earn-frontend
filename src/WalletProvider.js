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
    if (isWalletConnected && wallet?.publicKey) {
      // Redirect ke aplikasi Phantom jika wallet sudah terhubung
      window.location.href = `phantom://wallet/${wallet.publicKey.toBase58()}`;
    }
  };

  return (
    <>
      <WalletMultiButton onClick={handleWalletButtonClick} />
    </>
  );
};
