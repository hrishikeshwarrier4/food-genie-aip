import { createBrowserRouter } from "react-router-dom";
import AuthCallback from "./AuthCallback";
import Home from "./Home";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/auth/callback",
      element: <AuthCallback />,
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
