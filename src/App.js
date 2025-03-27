import React, { useEffect, useState } from "react";
import axios from "axios";
import Leaderboard from "./Leaderboard";
import TapFrenzy from "./TapFrenzy";
import * as WalletProvider from "./WalletProvider";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const API_URL = "https://maddog-token.site/user";

function App() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);

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
          })
          .catch((err) => console.error("Error fetching user data:", err));
      }
    }
  }, []);

  const handleTap = async () => {
    if (!user) return;
    try {
      const res = await axios.post(`${API_URL}/tap`, { telegramId: user.id });
      setBalance(res.data.balance);
    } catch (error) {
      alert("Gagal TAP, coba lagi nanti.");
    }
  };

  return (
    <WalletProvider.WalletProviderComponent>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-4">
          🚀 Maddog Token Tap-to-Earn
        </h1>
        <img
          src="https://raw.githubusercontent.com/Momoy369/maddog-token/refs/heads/master/image/maddog.png"
          alt="Maddog Token"
          className="rounded-full w-32 h-32 shadow-lg"
        />

        {user ? (
          <div className="mt-6 w-full max-w-lg p-6 bg-gray-800 rounded-lg shadow-md text-center">
            <p className="text-lg font-semibold">👤 {user.username}</p>
            <p className="text-xl font-bold text-green-400">
              💰 {balance} Coins
            </p>

            <button
              onClick={handleTap}
              className="mt-4 w-full py-3 bg-blue-500 hover:bg-blue-600 transition rounded-lg text-white font-semibold shadow-md"
            >
              💥 TAP!
            </button>

            <div className="mt-4">
              <WalletMultiButton />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 transition rounded-lg">
                🎁 Daily Reward
              </button>
              <button className="px-4 py-2 bg-green-500 hover:bg-green-600 transition rounded-lg">
                Withdraw
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-6">Loading...</p>
        )}

        <Leaderboard />
        {user && <TapFrenzy telegramId={user.id} updateBalance={setBalance} />}
      </div>
    </WalletProvider.WalletProviderComponent>
  );
}

export default App;
