import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>

      <App />
    </SnackbarProvider>
    </BrowserRouter>
  </StrictMode>
);
