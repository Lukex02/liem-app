import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Content from "./Content.tsx";
import TripFunc from "./component/TripFunc.tsx";
import VehicleFunc from "./component/VehicleFunc.tsx";
import DriverFunc from "./component/DriverFunc.tsx";
import AccInfo from "./component/AccInfo.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Content />,
  },
  {
    path: "account",
    element: <AccInfo />,
  },
  {
    path: "trip",
    element: <TripFunc />,
  },
  {
    path: "vehicle",
    element: <VehicleFunc />,
  },
  {
    path: "driver",
    element: <DriverFunc />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
