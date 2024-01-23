import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import SigninPage from "./pages/SigninPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: SigninPage,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
