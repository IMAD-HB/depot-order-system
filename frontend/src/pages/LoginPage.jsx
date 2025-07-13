import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { toast } from "react-hot-toast";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !motDePasse) {
      setErreur("Veuillez remplir tous les champs.");
      return;
    }

    setErreur("");
    setLoading(true);

    try {
      const { token, user } = await login({ email, password: motDePasse });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      onLogin?.(user);
      toast.success("Connexion réussie !");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Échec de la connexion. Vérifiez vos identifiants.");
      setErreur(err.message || "Échec de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setErreur("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#1f1c2c] to-[#928DAB] flex items-center justify-center p-4">
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl w-full max-w-md p-8">
        {/* Decorative Shape */}
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-30 blur-2xl animate-pulse z-0" />
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white text-center mb-6 tracking-wide">
            🔐 Connexion sécurisée
          </h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="text-white block mb-1 ml-1 text-sm">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                placeholder="Adresse e-mail"
                value={email}
                onChange={handleInputChange(setEmail)}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-white block mb-1 ml-1 text-sm">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                placeholder="Mot de passe"
                value={motDePasse}
                onChange={handleInputChange(setMotDePasse)}
              />
            </div>
            {erreur && (
              <p className="text-red-300 text-sm text-center animate-pulse">{erreur}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold shadow-lg hover:scale-[1.02] hover:shadow-pink-500/50 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion..." : "🚀 Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
