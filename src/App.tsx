import { useNavigate } from "react-router";
import { useEffect } from "react";
import { CgSpinner } from "react-icons/cg";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    user,
    getAccessTokenSilently,
  } = useAuth0();

  // Save token to localStorage after login and clear on logout
  useEffect(() => {
    const saveToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          localStorage.setItem("token", token);
          console.log("Token saved to localStorage");
        } catch (error) {
          console.error("Error getting token:", error);
        }
      } else {
        // Clear token when logged out
        localStorage.removeItem("token");
        console.log("Token removed from localStorage");
      }
    };

    saveToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  // Handle navigation after login
  useEffect(() => {
    if (isAuthenticated) {
      const intendedPath = sessionStorage.getItem("intendedPath");
      const cgid = sessionStorage.getItem("currentCgId");

      console.log("intendedPath:", intendedPath);
      console.log("cgid:", cgid);
      console.log("isAuthenticated:", isAuthenticated);

      if (intendedPath) {
        // Clear the intended path after using it
        sessionStorage.removeItem("intendedPath");
        navigate(intendedPath, { viewTransition: true });
      } else if (cgid) {
        navigate(`/cg/${cgid}`, { viewTransition: true });
      }
    }
  }, [isAuthenticated, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <main className="flex h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-2">
          <CgSpinner className="animate-spin" color="#41FAD3" size={28} />
          <p className="text-center">Loading...</p>
        </div>
      </main>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <main className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="w-full max-w-md rounded-lg border border-black/30 bg-white p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Welcome!</h1>
            <p className="text-gray-600">
              Sign in to access your connect group
            </p>
          </div>

          <button
            onClick={() => loginWithRedirect()}
            className="w-full rounded-md bg-[#41FAD3] px-6 py-3 font-semibold text-gray-900 transition-all hover:bg-[#35e8c2] active:scale-95"
          >
            Sign In
          </button>

          <div className="mt-6 text-center text-sm text-gray-500">
            Powered by FGACYC
          </div>
        </div>
      </main>
    );
  }

  // Show loading state after login while navigating
  return (
    <main className="flex h-screen items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-2">
        <CgSpinner className="animate-spin" color="#41FAD3" size={28} />
        <p className="text-center">
          Welcome back{user?.name ? `, ${user.name}` : ""}!
        </p>
      </div>
    </main>
  );
}

export default App;
