import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useState } from "react";

const ClaimButton = ({ points }) => {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    if (!publicKey) {
      alert("Hubungkan wallet terlebih dahulu!");
      return;
    }
    if (points < 500) {
      alert("Minimal 500 poin untuk withdraw!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/claim-token`, {
        wallet: publicKey.toBase58(),
        points: points,
      });

      alert(`Transaksi sukses! TX: ${response.data.txHash}`);
    } catch (error) {
      console.error("Error during claim:", error);
      alert(error.response?.data?.error || "Gagal klaim token!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClaim}
      disabled={loading || !publicKey} // Disable tombol jika wallet belum terhubung
      className={`p-3 rounded-lg ${
        loading || !publicKey ? "bg-gray-500" : "bg-green-600 text-white"
      }`}
    >
      {loading ? "Processing..." : "Claim Token"}
    </button>
  );
};

export default ClaimButton;
