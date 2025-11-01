import { Route, Routes } from "react-router";
import App from "../App";
import Callback from "../modules/_callbacks";
import { ProtectedRoute } from "../components/ProtectedRoute";
import Layout from "@/components/Layout";
import Details from "@/modules/Cg/Details";
import { ManageProfile } from "@/modules/ManageProfile";

export const MainRoutes = () => {
  return (
    <Routes>
      <Route index element={<App />} />
      <Route path="callback" element={<Callback />} />
      <Route
        path="cg"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="profile" element={<ManageProfile />} />
        <Route path=":id" element={<Details />} />
      </Route>
    </Routes>
  );
};
