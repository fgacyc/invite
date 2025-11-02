import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { MainRoutes } from "./routes/MainRoutes";

import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Auth0Provider } from "@auth0/auth0-react";

import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN as string}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID as string}
      authorizationParams={{
        redirect_uri: globalThis.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE as string,
      }}
    >
      <Toaster
        gutter={4}
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "2px",
            border: "1px solid #41FAD3",
            color: "black",
            padding: "0.25rem 0.5rem",
            fontFamily: "Inter",
            fontSize: "14px",
          },
        }}
      />
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools
            buttonPosition="bottom-left"
            initialIsOpen={false}
          />
          <MainRoutes />
        </QueryClientProvider>
        {/* <AuthDebugButton /> */}
      </BrowserRouter>
    </Auth0Provider>
  </StrictMode>,
);
