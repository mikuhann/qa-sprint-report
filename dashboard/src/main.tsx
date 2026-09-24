import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App";
import { PrintApp } from "./print/PrintApp";

const isPrintMode =
  new URLSearchParams(window.location.search).get("print") === "1";

createRoot(document.getElementById("root")!).render(
  isPrintMode ? (
    <PrintApp />
  ) : (
    <StrictMode>
      <App />
    </StrictMode>
  ),
);
