import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";

export default function Navbar({ utilisateur, onLogout }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef();
  const location = useLocation();

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!utilisateur) return null;

  return (
    <nav
      ref={menuRef}
      className="w-full max-w-6xl mx-auto mt-6 mb-8 px-4 md:px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg text-white"
    >
      {/* Mobile Toggle */}
      <div className="flex items-center justify-between md:hidden">
        <Link to="/" className="font-semibold text-lg">
          📊 Tableau de bord
        </Link>
        <button
          className="text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`${
          mobileOpen ? "block" : "hidden"
        } md:flex md:items-center md:gap-6 mt-4 md:mt-0`}
      >
        {/* Desktop Menu */}
        <Link
          to="/"
          className={`block px-2 py-1 font-semibold rounded-md transition hover:bg-white/20 ${
            isActive("/") ? "bg-white/20" : ""
          }`}
        >
          📊 Tableau de bord
        </Link>

        {/* Commandes Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleMenu("commandes")}
            className="flex items-center px-2 py-1 font-medium rounded-md transition hover:bg-white/20"
            aria-expanded={openMenu === "commandes"}
          >
            📦 Commandes <ChevronDown size={16} className="ml-1" />
          </button>
          {openMenu === "commandes" && (
            <div
              role="menu"
              className="absolute top-full mt-2 w-56 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl text-white z-20 animate-fade-in-down"
            >
              <Link
                to="/orders"
                role="menuitem"
                onClick={() => setOpenMenu(null)}
                className={`block px-4 py-2 transition rounded-md ${
                  isActive("/orders") ? "bg-white/20" : "hover:bg-white/20"
                }`}
              >
                Liste des commandes
              </Link>
              <Link
                to="/new"
                role="menuitem"
                onClick={() => setOpenMenu(null)}
                className={`block px-4 py-2 transition rounded-md ${
                  isActive("/new") ? "bg-white/20" : "hover:bg-white/20"
                }`}
              >
                Nouvelle commande
              </Link>
            </div>
          )}
        </div>

        {/* Produits Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleMenu("produits")}
            className="flex items-center px-2 py-1 font-medium rounded-md transition hover:bg-white/20"
            aria-expanded={openMenu === "produits"}
          >
            🛒 Produits <ChevronDown size={16} className="ml-1" />
          </button>
          {openMenu === "produits" && (
            <div
              role="menu"
              className="absolute top-full mt-2 w-56 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl text-white z-20 animate-fade-in-down"
            >
              <Link
                to="/produits"
                role="menuitem"
                onClick={() => setOpenMenu(null)}
                className={`block px-4 py-2 transition rounded-md ${
                  isActive("/produits") ? "bg-white/20" : "hover:bg-white/20"
                }`}
              >
                Liste des produits
              </Link>
              <Link
                to="/produits/nouveau"
                role="menuitem"
                onClick={() => setOpenMenu(null)}
                className={`block px-4 py-2 transition rounded-md ${
                  isActive("/produits/nouveau") ? "bg-white/20" : "hover:bg-white/20"
                }`}
              >
                Nouveau produit
              </Link>
            </div>
          )}
        </div>

        {/* Commentaires */}
        <Link
          to="/comments"
          className={`block px-2 py-1 font-medium rounded-md transition hover:bg-white/20 ${
            isActive("/comments") ? "bg-white/20" : ""
          }`}
        >
          💬 Commentaires
        </Link>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="md:ml-auto block text-red-400 px-2 py-1 font-medium rounded-md hover:underline"
        >
          Se déconnecter
        </button>
      </div>
    </nav>
  );
}
