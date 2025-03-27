import { useEffect, useMemo } from "react";
import axios from "axios";
import {
  ConnectionProvider,
  WalletProvider,
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

const WalletProviderComponent = ({ children }) => {
  const network = "mainnet-beta";
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

// ⬇️ Komponen ini akan dipanggil di dalam WalletProviderComponent
const WalletHandler = () => {
  const { publicKey } = useWallet();

  useEffect(() => {
    if (publicKey) {
      console.log("Wallet Connected:", publicKey.toBase58());

      axios
        .post("https://maddog-token.site/user/save-wallet", {
          walletAddress: publicKey.toBase58(),
        })
        .then((response) => console.log("Wallet saved:", response.data))
        .catch((error) => console.error("Error saving wallet:", error));
    }
  }, [publicKey]);

  return <WalletMultiButton />;
};

export default WalletProviderComponent;
