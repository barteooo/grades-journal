import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import SigninPage from "./pages/SigninPage";
import UserLayout from "./layouts/UserLayout";
import AdminMainPage from "./pages/UserPages/AdminMainPage";
import AdminUsersPage from "./pages/UserPages/AdminUsersPage";
import AdminClassesPages from "./pages/UserPages/AdminClassesPage";
import AdminTeachersClassPage from "./pages/UserPages/AdminTeachersClassPage";
import AdminTeachersSubjectsPage from "./pages/UserPages/AdminTeachersSubjectsPage";
import AdminSubjectForm from "./pages/UserPages/AdminSubjectForm";
import AdminClassForm from "./pages/UserPages/AdminClassForm";

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
      {
        path: "/admin/classes",
        Component: AdminClassesPages,
      },
      {
        path: "/admin/teachers",
        Component: AdminTeachersClassPage,
      },
      {
        path: "/admin/subjects/teachers",
        Component: AdminTeachersSubjectsPage,
      },
      {
        path: "/admin/subject",
        Component: AdminSubjectForm,
      },
      {
        path: "/admin/class",
        Component: AdminClassForm,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
