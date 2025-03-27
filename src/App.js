import React, { useEffect, useState } from "react";
import axios from "axios";
import Leaderboard from "./Leaderboard";
import TapFrenzy from "./TapFrenzy";
import WalletProviderComponent from "./WalletProvider";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const API_URL = "https://maddog-token.site/user";

function App() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [nonce, setNonce] = useState("");
  const tg = window.Telegram ? window.Telegram.WebApp : null;

  useEffect(() => {
    const tg = window.Telegram ? window.Telegram.WebApp : null;

    if (!tg) {
      console.error("❌ Telegram WebApp tidak tersedia!");
      alert("Harap buka aplikasi ini dari Telegram Mini Apps.");
      return;
    }

    tg.expand(); // Perbesar tampilan WebApp

    console.log("✅ Telegram WebApp terdeteksi:", tg);

    const initData = tg.initData || tg.initDataUnsafe;
    console.log("🔍 initData dari Telegram:", initData);

    if (!initData) {
      console.error(
        "❌ initData tidak ditemukan! Pastikan aplikasi dibuka dari Telegram Mini Apps."
      );
      return;
    }

    // Kirim data autentikasi ke backend
    axios
      .post(`${API_URL}/auth`, { initData })
      .then((res) => {
        console.log("✅ Autentikasi sukses:", res.data);
        setUser(res.data.user);
        setBalance(res.data.user.balance || 0);
      })
      .catch((err) => {
        console.error(
          "❌ Gagal memuat user:",
          err.response?.data || err.message
        );
      });
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

  const handleTap = () => {
    if (!user) return;
    axios
      .post(`${API_URL}/tap`, { telegramId: user.id })
      .then((res) => setBalance(res.data.balance));
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
