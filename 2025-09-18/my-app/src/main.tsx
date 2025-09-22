import { StrictMode } from "react";
import "./index.css";
import App from "./App.tsx";
import { createHashRouter, RouterProvider } from "react-router";
import ReactDOM from "react-dom/client";
import Home from "./components/Home.tsx";
import About from "./components/About.tsx";
import Something from "./components/Something.tsx";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/home", element: <Home /> },
      { path: "/something", element: <Something /> },
      { path: "/about", element: <About /> },
    ],
  },
]);

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
