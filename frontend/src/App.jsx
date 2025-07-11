import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import OrdersPage from "./pages/OrdersPage";
import NewOrderPage from "./pages/NewOrderPage";
import LoginPage from "./pages/LoginPage";
import { jwtDecode } from "jwt-decode";

function App() {
  const [utilisateur, setUtilisateur] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUtilisateur({ token, ...decoded });
      } catch (err) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUtilisateur(null);
  };

  const RoutePrivée = ({ children }) => {
    return utilisateur ? children : <Navigate to="/login" />;
  };

  const RoutePublique = ({ children }) => {
    return utilisateur ? <Navigate to="/" /> : children;
  };

  return (
    <Router>
      <nav className="bg-white shadow p-4 mb-4 flex gap-4 items-center">
        {utilisateur && (
          <>
            <Link to="/" className="text-blue-600 font-medium">
              📦 Commandes
            </Link>
            <Link to="/new" className="text-blue-600 font-medium">
              ➕ Nouvelle commande
            </Link>
          </>
        )}
        {utilisateur && (
          <button
            onClick={handleLogout}
            className="ml-auto text-red-600 font-medium"
          >
            Se déconnecter
          </button>
        )}
      </nav>

      <Routes>
        <Route
          path="/"
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
          path="/login"
          element={
            <RoutePublique>
              <LoginPage onLogin={setUtilisateur} />
            </RoutePublique>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
