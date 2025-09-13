import { createRoot } from "@wordpress/element";
import { StrictMode } from "react";
import { HashRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'


import "./index.css";
import App from "./app";

// 1. Create query client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 60 // 1 hour
        }
    }
})

// 2. Create an async persister (localStorage here, could also be sessionStorage or IndexedDB)
const localStoragePersister = createAsyncStoragePersister({
    storage: window.localStorage
})

// 3. Hook up persistence
persistQueryClient({
    queryClient,
    persister: localStoragePersister,
    maxAge: 1000 * 60 * 60 // 1 hour
})


const container = document.getElementById("wpstorm-clean-admin-dashboard");
const root = createRoot(container);

root.render(
  <QueryClientProvider client={queryClient}>
    <HashRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </HashRouter>
  </QueryClientProvider>
);
