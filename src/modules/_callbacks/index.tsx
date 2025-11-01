import { Navigate } from "react-router";
import { CgSpinner } from "react-icons/cg";
import { useAuth0 } from "@auth0/auth0-react";

const Callback = () => {
  const { isLoading, isAuthenticated } = useAuth0();
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="justfiy-center flex flex-col items-center gap-2">
          <CgSpinner className="animate-spin" color="#41FAD3" size={28} />
          <p className="text-center">Loading...</p>
        </div>
      </div>
    );
  }
  if (isAuthenticated) {
    return <Navigate to={`/cg/${sessionStorage.getItem("currentCgId")}`} />;
  }

  return <Navigate to="/" />;
};

export default Callback;
