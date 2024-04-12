import React from "react";
import ReactDOM from "react-dom/client";
import AccInfo from "./component/AccInfo";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";

ReactDOM.createRoot(document.getElementById("info")!).render(
  <React.StrictMode>
    <AccInfo />
  </React.StrictMode>
);
