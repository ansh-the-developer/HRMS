import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";

const theme = extendTheme({});
const queryClient = new QueryClient(); // ← Add this

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}> {/* ← Wrap App here */}
          <App />
        </QueryClientProvider>
      </ChakraProvider>
    </Auth0Provider>
  </React.StrictMode>
);
