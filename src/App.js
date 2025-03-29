import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import About from "./pages/About";
import Game from "./pages/Game";
import Reward from "./pages/Reward";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Router>
      <div className="container mx-auto flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-6 py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/game" element={<Game />} />
          <Route path="/reward" element={<Reward />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}
