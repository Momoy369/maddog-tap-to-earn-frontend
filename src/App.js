import React, { useEffect, useState } from "react";
import axios from "axios";
import Leaderboard from "./Leaderboard";
import TapFrenzy from "./TapFrenzy";
import { WalletProviderComponent } from "./WalletProvider";
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
    <WalletProviderComponent>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-6 py-10">
        <h1 className="text-4xl font-bold text-center mb-6">
          🚀 Maddog Token Tap-to-Earn
        </h1>

        <div className="flex flex-col items-center bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md">
          <img
            src="https://raw.githubusercontent.com/Momoy369/maddog-token/refs/heads/master/image/maddog.png"
            alt="Maddog Token"
            className="rounded-full w-28 h-28 shadow-md mb-4"
          />

          {user ? (
            <div className="text-center">
              <p className="text-lg font-semibold">👤 {user.username}</p>
              <p className="text-2xl font-bold text-green-400 my-2">
                💰 {balance} Coins
              </p>

              <button
                onClick={handleTap}
                className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 transition-all rounded-lg text-white font-semibold shadow-md"
              >
                💥 TAP!
              </button>

              <div className="mt-4 flex justify-center">
                <WalletMultiButton />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <button className="px-4 py-3 bg-yellow-500 hover:bg-yellow-600 transition-all rounded-lg w-full text-white font-semibold">
                  🎁 Daily Reward
                </button>
                <button className="px-4 py-3 bg-green-500 hover:bg-green-600 transition-all rounded-lg w-full text-white font-semibold">
                  Withdraw
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-6 text-lg">Loading...</p>
          )}
        </div>

        <div className="mt-8 w-full max-w-2xl">
          <Leaderboard />
          {user && (
            <TapFrenzy telegramId={user.id} updateBalance={setBalance} />
          )}
        </div>
      </div>
    </WalletProviderComponent>
  );
}

export default App;
