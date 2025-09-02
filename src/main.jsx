import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LmsPortal from "./LmsPortal.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LmsPortal />
  </React.StrictMode>
);
