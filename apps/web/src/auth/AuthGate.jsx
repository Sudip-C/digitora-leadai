import { LoaderCircle } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "./AuthContext.jsx";

function getReturnPath(location) {
  const previousLocation = location.state?.from;

  if (!previousLocation) {
    return "/";
  }

  return `${previousLocation.pathname ?? "/"}${previousLocation.search ?? ""}${
    previousLocation.hash ?? ""
  }`;
}

export default function AuthGate({ requireAuthentication = true }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="grid min-h-screen place-items-center bg-canvas px-6"
      >
        <div className="flex items-center gap-3 text-sm font-medium text-muted">
          <LoaderCircle className="size-5 animate-spin text-brand-600" aria-hidden="true" />
          Restoring your secure session
        </div>
      </div>
    );
  }

  if (requireAuthentication && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!requireAuthentication && isAuthenticated) {
    return <Navigate to={getReturnPath(location)} replace />;
  }

  return <Outlet />;
}
