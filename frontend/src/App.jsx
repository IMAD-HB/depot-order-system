import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import OrdersPage from "./pages/OrdersPage";
import NewOrderPage from "./pages/NewOrderPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import NewProductPage from "./pages/NewProductPage";
import CommentsPage from "./pages/CommentsPage";
import { jwtDecode } from "jwt-decode";
import Navbar from "./components/Navbar";
import { Toaster, toast } from "react-hot-toast";

function App() {
  const [utilisateur, setUtilisateur] = useState(null);

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUtilisateur({ token, ...decoded });
      } catch (err) {
        console.error("Token invalide :", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUtilisateur(null);
    toast.success("Déconnexion réussie");
  };

  // Guarded routes
  const RoutePrivée = ({ children }) =>
    utilisateur ? children : <Navigate to="/login" />;
  const RoutePublique = ({ children }) =>
    utilisateur ? <Navigate to="/" /> : children;

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-tr from-[#1f1c2c] to-[#928DAB] text-white">
        {/* Toast UI */}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1f1c2c",
              color: "#fff",
              border: "1px solid #ffffff30",
              backdropFilter: "blur(6px)",
            },
            success: {
              iconTheme: {
                primary: "#A855F7",
                secondary: "#fff",
              },
            },
          }}
        />

        {/* Navbar (shown only if logged in) */}
        <Navbar utilisateur={utilisateur} onLogout={handleLogout} />

        {/* Page Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          <Routes>
            <Route
              path="/"
              element={
                <RoutePrivée>
                  <DashboardPage />
                </RoutePrivée>
              }
            />
            <Route
              path="/orders"
              element={
                <RoutePrivée>
                  <OrdersPage />
                </RoutePrivée>
              }
            />
            <Route
              path="/new"
              element={
                <RoutePrivée>
                  <NewOrderPage />
                </RoutePrivée>
              }
            />
            <Route
              path="/produits"
              element={
                <RoutePrivée>
                  <ProductsPage />
                </RoutePrivée>
              }
            />
            <Route
              path="/produits/nouveau"
              element={
                <RoutePrivée>
                  <NewProductPage />
                </RoutePrivée>
              }
            />
            <Route
              path="/comments"
              element={
                <RoutePrivée>
                  <CommentsPage />
                </RoutePrivée>
              }
            />
            <Route
              path="/login"
              element={
                <RoutePublique>
                  <LoginPage onLogin={setUtilisateur} />
                </RoutePublique>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
