import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Leaderboard from "./Leaderboard";
import { WalletProviderComponent } from "./WalletProvider";
import Swal from "sweetalert2";

const API_URL = "https://maddog-token.site/user";

function App() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [referralLink, setReferralLink] = useState("Memuat...");
  const [taps, setTaps] = useState([]);
  const [isShaking, setIsShaking] = useState(false);
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });
  const [walletAddress, setWalletAddress] = useState("");
  const [showWalletInput, setShowWalletInput] = useState(false);

  const [lastWithdraw, setLastWithdraw] = useState(null);
  const [lastClaimed, setLastClaimed] = useState(null);
  const [hasUsedReferral, setHasUsedReferral] = useState(false);

  const imageRef = useRef(null);

  const handleWithdraw = () => {
    if (!walletAddress) {
      setShowWalletInput(true);
      return;
    }

    setIsLoading(true);

    axios
      .post(`${API_URL}/withdraw`, {
        telegramId: user.id,
        walletAddress: walletAddress,
      })
      .then((res) => {
        setIsLoading(false);

        if (res.data.error) {
          Swal.fire({
            title: "Error",
            text: res.data.error,
            icon: "error",
            confirmButtonText: "OK",
          });
        } else {
          setBalance(res.data.balance);
          Swal.fire({
            title: "Success",
            text: "Withdraw berhasil!",
            icon: "success",
            confirmButtonText: "OK",
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);

        console.error("Error withdrawing:", err);
        Swal.fire({
          title: "Error",
          text: "Terjadi kesalahan saat memproses withdraw.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      const userData = tg.initDataUnsafe?.user;

      if (userData) {
        const urlParams = new URLSearchParams(window.location.search);
        const referrerId = urlParams.get("start");

        axios
          .post(`${API_URL}/register`, { telegramId: userData.id, referrerId })
          .then((res) => {
            console.log("API Response:", res.data);
            setUser(userData);
            setBalance(res.data.balance || 0);
            setHasUsedReferral(res.data.hasUsedReferral || false);
            setReferralLink(
              `https://t.me/maddog_token_bot?start=${userData.id}`
            );
            setLastWithdraw(
              res.data.lastWithdraw ? new Date(res.data.lastWithdraw) : null
            );
            setLastClaimed(
              res.data.lastClaimed ? new Date(res.data.lastClaimed) : null
            );
          })
          .catch((err) => {
            console.error("Error fetching user data:", err);
          });
      }
    }
  }, []);

  const handleTap = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newTap = { id: Date.now(), value: "+1", x, y };
    setTaps((prevTaps) => [...prevTaps, newTap]);

    axios
      .post(`${API_URL}/tap`, { telegramId: user.id })
      .then((res) => {
        if (res.data) {
          setBalance((prev) => prev + 1);
        }
      })
      .catch((err) => console.error("Error updating balance:", err));

    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    setTimeout(() => {
      setTaps((prev) => prev.filter((tap) => tap.id !== newTap.id));
    }, 1000);
  };

  const copyReferralCode = () => {
    if (referralLink === "Memuat..." || referralLink === "Belum tersedia") {
      alert("Kode referral belum tersedia.");
      return;
    }

    setTimeout(() => {
      navigator.clipboard
        .writeText(referralLink)
        .then(() => {
          alert("Tautan referral berhasil disalin! 📋");
        })
        .catch((err) => {
          console.error("Gagal menyalin ke clipboard", err);
          alert("Terjadi kesalahan saat menyalin kode referral.");
        });
    }, 0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-6">
        🚀 Maddog Token Tap-to-Earn
      </h1>

      <div className="flex flex-col items-center bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md">
        <img
          src="https://raw.githubusercontent.com/Momoy369/maddog-token/refs/heads/master/image/maddog.png"
          alt="Maddog Token"
          className={`rounded-full w-28 h-28 shadow-md mb-4 cursor-pointer ${
            isShaking ? "animate-shake" : ""
          }`}
          onClick={handleTap}
          ref={imageRef}
        />
        <div className="relative">
          {taps.map((tap) => (
            <div
              key={tap.id}
              className="absolute text-green-500 text-xl animate-fadeUp"
              style={{
                left: `${tap.x}px`,
                top: `${tap.y}px`,
                animationDuration: "1s",
              }}
            >
              {tap.value}
            </div>
          ))}
        </div>
        <p>
          Last Withdraw:{" "}
          {lastWithdraw
            ? lastWithdraw.toLocaleString()
            : "Belum pernah withdraw"}
        </p>
        <p>
          Last Claimed:{" "}
          {lastClaimed ? lastClaimed.toLocaleString() : "Belum pernah klaim"}
        </p>

        {hasUsedReferral && (
          <p className="text-red-500 mt-2">
            Anda sudah menggunakan referral sebelumnya.
          </p>
        )}

        <div className="flex justify-between w-full">
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
                })
                .catch((err) => console.error("Error claiming reward:", err));
            }}
            className="mt-3 px-4 py-2 bg-green-500 hover:bg-green-600 transition-all rounded-lg w-48 text-white font-semibold"
          >
            🎁 Klaim Harian
          </button>

          <button
            onClick={handleWithdraw}
            disabled={balance < 50000 || !walletAddress || isLoading}
            className={`mt-3 px-4 py-2 transition-all rounded-lg w-48 text-white font-semibold ${
              balance < 50000 || !walletAddress || isLoading
                ? "bg-gray-400 cursor-not-allowed opacity-50"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isLoading ? (
              <div className="loader"></div>
            ) : (
              <>💸 Withdraw</>
            )}
          </button>
        </div>

        {showWalletInput && (
          <div className="mt-3 w-full max-w-md">
            <label className="block text-sm text-white mb-2">
              Masukkan Alamat Wallet:
            </label>
            <input
              type="text"
              className="w-full p-2 rounded-lg text-black"
              placeholder="Alamat wallet"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
            <button
              onClick={handleWithdraw}
              className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-all rounded-lg w-full text-white font-semibold"
            >
              Konfirmasi Withdraw
            </button>
          </div>
        )}

        {user ? (
          <div className="text-center">
            <p className="text-lg font-semibold">👤 {user.username}</p>
            <p className="text-2xl font-bold text-green-400 my-2">
              💰 {balance} Coins
            </p>
            <div className="mt-4">
              <WalletProviderComponent></WalletProviderComponent>
            </div>
            <div className="mt-6 bg-gray-700 p-4 rounded-lg w-full">
              <p className="text-lg font-semibold">🔗 Kode Referral</p>
              <p className="bg-gray-900 py-2 px-4 rounded-lg mt-2">
                {referralLink}
              </p>
              <button
                onClick={copyReferralCode}
                className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg w-full"
              >
                Salin Kode Referral
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 text-center">
            <p>Memuat data pengguna...</p>
          </div>
        )}
      </div>

      <div className="mt-8 w-full max-w-2xl">
        <Leaderboard />
      </div>
    </div>
  );
}

export default App;
