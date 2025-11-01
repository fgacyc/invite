import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, useLocation } from "react-router";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();

  useEffect(() => {
    // Save the intended destination before redirecting to login
    if (!isLoading && !isAuthenticated) {
      // Extract CG ID from pathname like /cg/123
      const cgIdRegex = /\/cg\/([^/]+)/;
      const cgIdMatch = cgIdRegex.exec(location.pathname);
      if (cgIdMatch?.[1]) {
        sessionStorage.setItem("currentCgId", cgIdMatch[1]);
        sessionStorage.setItem("intendedPath", location.pathname);
      }
    }
  }, [isLoading, isAuthenticated, location.pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
