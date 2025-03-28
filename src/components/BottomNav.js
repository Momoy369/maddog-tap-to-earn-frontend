import React, { useState } from "react";
import { Home, Info, Gamepad2, Gift, User } from "lucide-react";

function BottomNav() {
  const [active, setActive] = useState("home");

  const menuItems = [
    { id: "home", label: "Beranda", icon: <Home size={24} /> },
    { id: "about", label: "Tentang", icon: <Info size={24} /> },
    { id: "game", label: "Game", icon: <Gamepad2 size={24} /> },
    { id: "reward", label: "Reward", icon: <Gift size={24} /> },
    { id: "profile", label: "Profil", icon: <User size={24} /> },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-gray-800 text-white rounded-full shadow-lg flex justify-around py-3 px-4">
      {menuItems.map((item) => (
        <button
          key={item.id}
          className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all ${
            active === item.id
              ? "text-blue-400"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActive(item.id)}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

export default BottomNav;
