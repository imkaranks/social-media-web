import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { auth } = useAuth();
  const location = useLocation();

  return auth ? (
    children || <Outlet />
  ) : (
    <Navigate to={"/sign-in"} state={{ from: location }} replace />
  );
}
