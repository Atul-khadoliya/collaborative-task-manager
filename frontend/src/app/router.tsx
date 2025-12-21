import { createBrowserRouter, Outlet } from "react-router-dom";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../components/Navbar";
import Dashboard from "../features/tasks/Dashboard";

const Layout = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 text-gray-900">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <div>Public Home</div> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
