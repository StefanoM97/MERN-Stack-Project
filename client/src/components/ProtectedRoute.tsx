import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading session…</p>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
