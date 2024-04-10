import React from "react";
import ReactDOM from "react-dom/client";
import Content from "./Content.tsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";

ReactDOM.createRoot(document.getElementById("content")!).render(
  <React.StrictMode>
    <Content />
  </React.StrictMode>
);
