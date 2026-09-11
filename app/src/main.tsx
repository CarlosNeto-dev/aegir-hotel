import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Layout from "./components/layout/Layout";
import "./styles/main.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Layout />
  </StrictMode>,
);
