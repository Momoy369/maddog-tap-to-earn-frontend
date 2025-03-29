import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Info, Gamepad2, Gift, User } from "lucide-react";

function BottomNav() {
  const location = useLocation();

  const menuItems = [
    { id: "/", label: "Beranda", icon: <Home size={24} />, path: "/" },
    {
      id: "/about",
      label: "Tentang",
      icon: <Info size={24} />,
      path: "/about",
    },
    { id: "/game", label: "Game", icon: <Gamepad2 size={24} />, path: "/game" },
    {
      id: "/reward",
      label: "Reward",
      icon: <Gift size={24} />,
      path: "/reward",
    },
    {
      id: "/profile",
      label: "Profil",
      icon: <User size={24} />,
      path: "/profile",
    },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-gray-800 text-white rounded-full shadow-lg flex justify-around py-3 px-4">
      {menuItems.map((item) => (
        <Link
          key={item.id}
          to={item.path}
          className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all ${
            location.pathname === item.path
              ? "text-blue-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </Link>
      ))}
    </div>
  );
}

export default BottomNav;
