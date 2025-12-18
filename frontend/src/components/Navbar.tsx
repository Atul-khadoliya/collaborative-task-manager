import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-800 text-white">
      <Link to="/" className="font-semibold">
        Task Manager
      </Link>

      <div className="space-x-4">
        {!isAuthenticated ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
