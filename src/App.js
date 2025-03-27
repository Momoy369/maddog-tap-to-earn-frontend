import React, { useEffect, useState } from "react";
import axios from "axios";
import Leaderboard from "./Leaderboard";
import { WalletProviderComponent } from "./WalletProvider";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const API_URL = "https://maddog-token.site/user";

function App() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [referralCode, setReferralCode] = useState("Memuat...");
  const [lastWithdraw, setLastWithdraw] = useState(null);
  const [lastClaimed, setLastClaimed] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      const userData = tg.initDataUnsafe?.user;

      if (userData) {
        axios
          .post(`${API_URL}/register`, { telegramId: userData.id })
          .then((res) => {
            setUser(userData);
            setBalance(res.data.balance || 0);
            setReferralCode(res.data.referralCode ?? "Belum tersedia");
            setLastWithdraw(
              res.data.lastWithdraw ? new Date(res.data.lastWithdraw) : null
            );
            setLastClaimed(
              res.data.lastClaimed ? new Date(res.data.lastClaimed) : null
            );
          })
          .catch(() => setReferralCode("Gagal memuat"));
      }
    }
  }, []);

  const copyReferralCode = () => {
    if (
      !referralCode ||
      referralCode === "Memuat..." ||
      referralCode === "Belum tersedia"
    ) {
      alert("Kode referral belum tersedia.");
      return;
    }
    navigator.clipboard.writeText(referralCode);
    alert("Kode referral berhasil disalin! 📋");
  };

  return (
    <WalletProviderComponent>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-6 py-10 space-y-6">
        <h1 className="text-4xl font-bold text-center">
          🚀 Maddog Token Tap-to-Earn
        </h1>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg text-center">
          <img
            src="https://raw.githubusercontent.com/Momoy369/maddog-token/refs/heads/master/image/maddog.png"
            alt="Maddog Token"
            className="rounded-full w-24 h-24 mx-auto shadow-md mb-4"
          />
          <p className="text-sm text-gray-400">
            Last Withdraw:{" "}
            {lastWithdraw
              ? lastWithdraw.toLocaleString()
              : "Belum pernah withdraw"}
          </p>
          <p className="text-sm text-gray-400">
            Last Claimed:{" "}
            {lastClaimed ? lastClaimed.toLocaleString() : "Belum pernah klaim"}
          </p>

          <div className="mt-4 space-y-3">
            <button
              onClick={() => {
                axios
                  .post(`${API_URL}/claim`, { telegramId: user.id })
                  .then((res) => {
                    if (res.data.error) {
                      alert(res.data.error);
                    } else {
                      setBalance(res.data.balance);
                      setLastClaimed(new Date(res.data.lastClaimed));
                      alert("Daily reward berhasil diklaim!");
                    }
                  });
              }}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 transition-all rounded-lg w-full text-white font-semibold"
            >
              🎁 Klaim Harian
            </button>

            <button
              onClick={() => {
                axios
                  .post(`${API_URL}/withdraw`, {
                    telegramId: user.id,
                    walletAddress: "your-wallet-address",
                  })
                  .then((res) => {
                    if (res.data.error) {
                      alert(res.data.error);
                    } else {
                      setBalance(res.data.balance);
                      setLastWithdraw(new Date(res.data.lastWithdraw));
                      alert("Withdraw berhasil!");
                    }
                  });
              }}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-all rounded-lg w-full text-white font-semibold"
            >
              💸 Withdraw
            </button>
          </div>

          {user ? (
            <div className="mt-6">
              <p className="text-lg font-semibold">👤 {user.username}</p>
              <p className="text-2xl font-bold text-green-400 my-2">
                💰 {balance} Coins
              </p>
              <WalletMultiButton className="mt-4" />

              <div className="mt-6 bg-gray-700 p-4 rounded-lg">
                <p className="text-lg font-semibold">🔗 Kode Referral</p>
                <p className="bg-gray-900 py-2 px-4 rounded-lg mt-2">
                  {referralCode}
                </p>
                <button
                  onClick={copyReferralCode}
                  className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg w-full"
                >
                  📋 Salin Kode
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-6 text-lg">Loading...</p>
          )}
        </div>

        <div className="w-full max-w-2xl">
          <Leaderboard />
        </div>
      </div>
    </WalletProviderComponent>
  );
}

export default App;
