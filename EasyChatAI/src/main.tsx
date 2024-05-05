import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "@/index.css"
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import Home from '@/routes/home'
import ErrorPage from "@/error-page";
const router = createHashRouter([
  {
    path: "/",
    element: <Home></Home>,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);