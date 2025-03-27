import React, { useEffect, useState } from "react";
import axios from "axios";
import Leaderboard from "./Leaderboard";
import TapFrenzy from "./TapFrenzy";
import WalletProviderComponent from "./WalletProvider";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const API_URL = "https://maddog-token.site/api";

function App() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [nonce, setNonce] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready(); // Pastikan WebApp siap sebelum mengambil data
      tg.expand();
      const userData = tg.initDataUnsafe?.user;

      if (userData) {
        axios
          .post(`${API_URL}/register`, { telegramId: userData.id })
          .then((res) => {
            setUser(userData);
            setBalance(res.data.balance || 0);
          })
          .catch((err) => console.error("Error fetching user data:", err));
      }
    } else {
      console.warn("Telegram WebApp tidak tersedia!");
    }
  }, []);

  const referralLink = user
    ? `https://t.me/maddog_token_bot?start=${user.id}`
    : "";

  const claimDailyReward = () => {
    if (!user) return alert("User belum login!");
    axios
      .post(`${API_URL}/daily-reward`, { telegramId: user.id })
      .then((res) => setBalance(res.data.balance));
  };

  const handleTap = async () => {
    if (!user) return;

    try {
      const res = await axios.post(`${API_URL}/tap`, { telegramId: user.id });
      setBalance(res.data.balance);
    } catch (error) {
      console.error("Error saat TAP:", error);
      alert("Gagal TAP, coba lagi nanti.");
    }
  };

  const handleWithdraw = async () => {
    if (balance < 500) {
      return alert("Saldo minimal 500 coins untuk withdraw!");
    }

    const wallet = prompt("Masukkan alamat Solana wallet:");
    if (!wallet) return;

    try {
      const response = await axios.post(`${API_URL}/withdraw`, {
        telegramId: user.id,
        wallet: wallet,
        nonce: nonce,
      });

      if (response.data.success) {
        alert("Withdraw berhasil!");
        setBalance(response.data.newBalance);
      } else {
        alert("Withdraw gagal: " + response.data.message);
      }
    } catch (error) {
      alert(
        "Terjadi kesalahan: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const requestWithdraw = async () => {
    if (!user) return alert("Anda harus login dulu!");

    try {
      const response = await axios.post(`${API_URL}/request-withdraw`, {
        telegramId: user.id,
      });

      if (response.data.success) {
        alert("Kode konfirmasi telah dikirim ke Telegram Anda.");
        setNonce(""); // Reset nonce setelah meminta kode
      } else {
        alert("Gagal mengirim kode. Coba lagi.");
      }
    } catch (error) {
      alert(
        "Terjadi kesalahan: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold">
        🚀 Tap-to-Earn Maddog Token Meme Coin
      </h1>
      <br></br>
      <p>
        <img
          src="https://raw.githubusercontent.com/Momoy369/maddog-token/refs/heads/master/image/maddog.png"
          alt="Maddog Token"
          className="rounded-full w-40 h-40"
        />
      </p>
      <br></br>
      {user ? (
        <>
          <p className="mt-2">👤 {user.username}</p>
          <p className="mt-2">💰 Balance: {balance} coins</p>
          <button
            onClick={handleTap}
            className="mt-4 px-6 py-3 bg-blue-500 rounded-lg"
          >
            💥 TAP!
          </button>
          <button
            onClick={handleWithdraw}
            className="mt-4 px-6 py-3 bg-green-500 rounded-lg"
          >
            Withdraw
          </button>

          <button
            onClick={requestWithdraw}
            className="mt-4 px-6 py-3 bg-orange-500 rounded-lg"
          >
            📩 Minta Kode Withdraw
          </button>

          <input
            type="text"
            placeholder="Masukkan kode nonce"
            value={nonce}
            onChange={(e) => setNonce(e.target.value)}
            className="mt-2 p-2 bg-gray-700 text-white rounded-lg"
          />

          <WalletProviderComponent>
            <div className="p-6 bg-gray-900 text-white min-h-screen">
              <h1 className="text-2xl font-bold">🚀 Solana Tap-to-Earn</h1>
              <WalletMultiButton />
            </div>
          </WalletProviderComponent>

          <p className="mt-4">🔗 Share your referral link:</p>
          <input
            type="text"
            value={referralLink}
            readOnly
            className="mt-2 p-2 bg-gray-700 text-white rounded-lg"
          />

          <button
            onClick={claimDailyReward}
            className="mt-4 px-6 py-3 bg-yellow-500 rounded-lg"
          >
            🎁 Claim Daily Reward
          </button>

          {/* Perbaiki cara render komponen ini */}
          <Leaderboard />
          <TapFrenzy telegramId={user.id} updateBalance={setBalance} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
