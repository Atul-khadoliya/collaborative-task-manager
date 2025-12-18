import { createBrowserRouter, Outlet } from "react-router-dom";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../components/Navbar";
import Dashboard from "../features/tasks/Dashboard";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </main>
    </>
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
