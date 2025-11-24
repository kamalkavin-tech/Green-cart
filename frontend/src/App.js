import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import OptimizerPage from "./pages/OptimizerPage";
import { Toaster } from "@/components/ui/sonner";
import { Leaf } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800" style={{fontFamily: "Space Grotesk, sans-serif"}}>
              GreenerCart
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              data-testid="nav-home-link"
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                isActive("/")
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                  : "text-gray-600 hover:bg-green-50"
              }`}
            >
              Home
            </Link>
            <Link
              to="/optimizer"
              data-testid="nav-optimizer-link"
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                isActive("/optimizer")
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                  : "text-gray-600 hover:bg-green-50"
              }`}
            >
              Optimizer
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-100 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-8 text-center">
        <p className="text-gray-600" style={{fontFamily: "Inter, sans-serif"}}>
          2025 GreenerCart – Built for RegenHack VR 2.0
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Making e-commerce sustainable, one delivery at a time 
        </p>
      </div>
    </footer>
  );
};

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/optimizer" element={<OptimizerPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
