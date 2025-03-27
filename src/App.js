import React, { useEffect, useState } from "react";
import axios from "axios";
import Leaderboard from "./Leaderboard";
import { WalletProviderComponent } from "./WalletProvider";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";

const API_URL = "https://maddog-token.site/user";
const MIN_WITHDRAW = 50000;

function App() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [taps, setTaps] = useState([]);
  const [referralCode, setReferralCode] = useState("");

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
            setReferralCode(res.data.referralCode || ""); // Set referral code
          })
          .catch((err) => console.error("Error fetching user data:", err));
      }
    }
  }, []);

  // Handle Tap Animation & Coin Update
  const handleTap = async (event) => {
    if (!user) return;
    try {
      const res = await axios.post(`${API_URL}/tap`, { telegramId: user.id });
      setBalance(res.data.balance);

      const newTap = {
        id: Date.now(),
        x: event.clientX,
        y: event.clientY,
        value: "+1",
      };
      setTaps((prevTaps) => [...prevTaps, newTap]);

      setTimeout(() => {
        setTaps((prevTaps) => prevTaps.filter((tap) => tap.id !== newTap.id));
      }, 1000);
    } catch (error) {
      alert("Gagal TAP, coba lagi nanti.");
    }
  };

  // Handle Daily Reward
  const claimDailyReward = async () => {
    if (!user) return;
    try {
      const res = await axios.post(`${API_URL}/daily-reward`, {
        telegramId: user.id,
      });
      setBalance(res.data.balance);
      alert("Daily Reward berhasil diklaim! 🎁");
    } catch (error) {
      alert("Gagal klaim Daily Reward, coba lagi nanti.");
    }
  };

  // Handle Withdraw (minimal 50,000 poin)
  const handleWithdraw = async () => {
    if (!user) return;
    if (balance < MIN_WITHDRAW) {
      alert(`Minimal withdraw adalah ${MIN_WITHDRAW} coins!`);
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/withdraw`, {
        telegramId: user.id,
      });
      setBalance(res.data.balance);
      alert("Withdraw berhasil! 💸");
    } catch (error) {
      alert("Gagal withdraw, coba lagi nanti.");
    }
  };

  // Handle Copy Referral Code
  const copyReferralCode = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    alert("Kode referral berhasil disalin! 📋");
  };

  return (
    <WalletProviderComponent>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-6 py-10 relative">
        <h1 className="text-4xl font-bold text-center mb-6">
          🚀 Maddog Token Tap-to-Earn
        </h1>

        <div className="flex flex-col items-center bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md relative">
          <img
            src="https://raw.githubusercontent.com/Momoy369/maddog-token/refs/heads/master/image/maddog.png"
            alt="Maddog Token"
            className="rounded-full w-28 h-28 shadow-md mb-4 cursor-pointer"
            onClick={handleTap}
          />

          {user ? (
            <div className="text-center">
              <p className="text-lg font-semibold">👤 {user.username}</p>
              <p className="text-2xl font-bold text-green-400 my-2">
                💰 {balance} Coins
              </p>

              <div className="mt-4 flex justify-center">
                <WalletMultiButton />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  onClick={claimDailyReward}
                  className="px-4 py-3 bg-yellow-500 hover:bg-yellow-600 transition-all rounded-lg w-full text-white font-semibold"
                >
                  🎁 Daily Reward
                </button>
                <button
                  onClick={handleWithdraw}
                  className={`px-4 py-3 ${
                    balance >= MIN_WITHDRAW
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-500 cursor-not-allowed"
                  } transition-all rounded-lg w-full text-white font-semibold`}
                  disabled={balance < MIN_WITHDRAW}
                >
                  Withdraw
                </button>
              </div>

              {/* Referral Section */}
              <div className="mt-6 bg-gray-700 p-4 rounded-lg text-center w-full">
                <p className="text-lg font-semibold">🔗 Kode Referral</p>
                <p className="bg-gray-900 text-white py-2 px-4 rounded-lg mt-2">
                  {referralCode || "Memuat..."}
                </p>
                <button
                  onClick={copyReferralCode}
                  className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-all rounded-lg w-full text-white font-semibold"
                >
                  📋 Salin Kode
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-6 text-lg">Loading...</p>
          )}
        </div>

        <div className="mt-8 w-full max-w-2xl">
          <Leaderboard />
        </div>

        {taps.map((tap) => (
          <motion.span
            key={tap.id}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -50 }}
            transition={{ duration: 1 }}
            className="absolute text-lg font-bold text-green-400"
            style={{ top: tap.y, left: tap.x }}
          >
            {tap.value}
          </motion.span>
        ))}
      </div>
    </WalletProviderComponent>
  );
}

export default App;
