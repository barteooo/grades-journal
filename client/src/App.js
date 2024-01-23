import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import SigninPage from "./pages/SigninPage";
import UserLayout from "./layouts/UserLayout";
import AdminMainPage from "./pages/UserPages/AdminMainPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: SigninPage,
  },
  {
    path: "/user",
    Component: UserLayout,
    children: [
      {
        path: "/user",
        Component: AdminMainPage,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
