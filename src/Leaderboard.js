import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://maddog-token.site/user";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/leaderboard`)
      .then((res) => setLeaderboard(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-4 bg-gray-800 rounded-lg overflow-x-auto">
      <h2 className="text-lg font-bold text-white">🏆 Leaderboard</h2>
      <ul className="mt-2 text-white w-full max-w-full">
        {leaderboard.map((user, index) => (
          <li
            key={index}
            className="flex justify-between py-2 border-b border-gray-700"
          >
            <span>
              {index + 1}. {user.username || user.telegramId}
            </span>
            <span>{user.balance} coins</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Leaderboard;
