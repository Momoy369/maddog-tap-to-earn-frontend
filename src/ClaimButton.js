import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useState, useEffect } from "react";

const ClaimButton = ({ points }) => {
  const wallet = useWallet();
  const publicKey = wallet?.publicKey || null;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("publicKey:", publicKey);
  }, [publicKey]);

  const handleClaim = async () => {
    if (!publicKey) return alert("Hubungkan wallet terlebih dahulu!");
    if (points < 500) return alert("Minimal 500 poin untuk withdraw!");

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/claim-token`, {
        wallet: publicKey.toBase58(),
        points: points,
      });

      alert(`Transaksi sukses! TX: ${response.data.txHash}`);
    } catch (error) {
      alert(error.response?.data?.error || "Gagal klaim token!");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleClaim}
      disabled={loading}
      className="p-3 bg-green-600 text-white rounded-lg"
    >
      {loading ? "Processing..." : "Claim Token"}
    </button>
  );
};

export default ClaimButton;
