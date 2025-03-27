import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://maddog-token.site/user/game";

function TapFrenzy({ telegramId, updateBalance }) {
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, isPlaying]);

  const startGame = () => {
    setTaps(0);
    setTimeLeft(10);
    setIsPlaying(true);
  };

  const tap = () => {
    if (isPlaying) setTaps(taps + 1);
  };

  const endGame = () => {
    setIsPlaying(false);
    axios
      .post(`${API_URL}/tap-frenzy`, { telegramId, taps })
      .then((res) => updateBalance(res.data.balance));
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white">
      <h2 className="text-lg font-bold">🎮 Tap Frenzy</h2>
      <p className="mt-2">
        Waktu: {timeLeft}s | Tap: {taps}
      </p>
      {isPlaying ? (
        <button onClick={tap} className="mt-4 px-6 py-3 bg-blue-500 rounded-lg">
          TAP!
        </button>
      ) : (
        <button
          onClick={startGame}
          className="mt-4 px-6 py-3 bg-green-500 rounded-lg"
        >
          Mulai Game
        </button>
      )}
    </div>
  );
}

export default TapFrenzy;
