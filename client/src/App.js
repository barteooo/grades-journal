import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import SigninPage from "./pages/SigninPage";
import UserLayout from "./layouts/UserLayout";
import AdminMainPage from "./pages/UserPages/AdminMainPage";
import AdminUsersPage from "./pages/UserPages/AdminUsersPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: SigninPage,
  },
  {
    path: "/admin",
    Component: UserLayout,
    children: [
      {
        path: "/admin",
        Component: AdminMainPage,
      },
      {
        path: "/admin/users",
        Component: AdminUsersPage,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
