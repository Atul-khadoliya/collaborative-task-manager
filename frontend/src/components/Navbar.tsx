import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { useState, useRef, useEffect } from "react";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="
        sticky top-0 z-50
        flex items-center justify-end
        px-8 py-4
        bg-white/80
        backdrop-blur-xl
        shadow-sm shadow-zinc-200/60
      "
    >
      <div className="flex items-center gap-6">
        {/* 🔔 Notifications */}
        {isAuthenticated && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="
                relative
                w-9 h-9
                flex items-center justify-center
                rounded-full
                bg-zinc-100
                hover:bg-zinc-200
                transition
              "
            >
              <span className="text-[17px] text-zinc-700">🔔</span>

              {unreadCount > 0 && (
                <span
                  className="
                    absolute -top-1 -right-1
                    min-w-[16px] h-[16px]
                    flex items-center justify-center
                    rounded-full
                    bg-indigo-600
                    text-[10px] font-medium
                    text-white
                  "
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {open && (
              <div
                className="
                  absolute right-0 mt-3
                  w-80
                  bg-white
                  rounded-xl
                  shadow-lg shadow-zinc-200/60
                  border border-zinc-100
                  overflow-hidden
                "
              >
                <div className="px-4 py-3 border-b border-zinc-100">
                  <h4 className="text-sm font-semibold text-zinc-900">
                    Notifications
                  </h4>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {/* Empty state */}
                  <div className="px-4 py-6 text-sm text-zinc-500 text-center">
                    No new notifications
                  </div>

                  {/* Example item (replace later) */}
                  {/* 
                  <div className="
                    px-4 py-3
                    hover:bg-zinc-50
                    transition
                    cursor-pointer
                  ">
                    <p className="text-sm text-zinc-800">
                      Task <span className="font-medium">Design Review</span> was updated
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">
                      2 minutes ago
                    </p>
                  </div>
                  */}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Auth / Navigation */}
        {!isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="
                text-sm font-medium
                px-5 py-2
                rounded-full
                bg-indigo-600
                text-white
                hover:bg-indigo-500
                shadow-sm
              "
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="
                text-sm font-medium
                px-5 py-2
                rounded-full
                bg-zinc-100
                text-zinc-700
                hover:bg-zinc-200
              "
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
