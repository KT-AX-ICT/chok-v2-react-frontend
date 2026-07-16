import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthed } = useAuth();
  const loc = useLocation();
  if (!isAuthed) return <Navigate to="/login" replace state={{ from: loc }} />;
  return <>{children}</>;
}
