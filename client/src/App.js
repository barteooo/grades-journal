import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import SigninPage from "./pages/SigninPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminMainPage from "./pages/AdminPages/AdminMainPage";
import AdminUsersPage from "./pages/AdminPages/AdminUsersPage";
import AdminClassesPages from "./pages/AdminPages/AdminClassesPage";
import AdminTeachersClassPage from "./pages/AdminPages/AdminTeachersClassPage";
import AdminTeachersSubjectsPage from "./pages/AdminPages/AdminTeachersSubjectsPage";
import AdminSubjectForm from "./pages/AdminPages/AdminSubjectForm";
import AdminClassForm from "./pages/AdminPages/AdminClassForm";
import AdminSubjectsPage from "./pages/AdminPages/AdminSubjectsPage";
import TeacherLayout from "./layouts/TeacherLayout";
import TeacherMainPage from "./pages/TeacherPages/TeacherMainPage";
import AuthService from "./services/AuthService";
import UsersApi from "./api/UsersApi";
import { useContext, useEffect } from "react";
import AppContext from "./Context/AppContext";
import JournalPage from "./pages/TeacherPages/JournalPage";
import TeacherChatsPage from "./pages/TeacherPages/TeacherChatsPage";
import socket from "./sockets";
import StudentMainPage from "./pages/StudentPages/StudentMainPage";
import StudentJournalPage from "./pages/StudentPages/StudentJournalPage";
import StudentChatsPage from "./pages/StudentPages/StudentChatsPage";
import StudentLayout from "./layouts/StudentLayout";
import mqtt from "mqtt";

const checkIsAuth = async () => {
  const token = AuthService.getToken();
  if (!token) {
    return null;
  }

  const userId = AuthService.getUserId();
  const result = await UsersApi.getUser(userId);
  if (!result.success || !result.user) {
    return null;
  }

  return result.user;
};

const adminAuthLoader = async () => {
  const user = await checkIsAuth();
  if (!user) {
    return redirect("/");
  }

  if (user.role !== "admin") {
    return redirect("/");
  }
  return null;
};

const teacherAuthLoader = async () => {
  const user = await checkIsAuth();
  if (!user) {
    return redirect("/");
  }

  if (user.role !== "teacher") {
    return redirect("/");
  }
  return null;
};

const studentAuthLoader = async () => {
  const user = await checkIsAuth();
  if (!user) {
    return redirect("/");
  }

  if (user.role !== "student") {
    return redirect("/");
  }
  return null;
};

const nonAuthLoader = async () => {
  const user = await checkIsAuth();
  if (user) {
    if (user.role === "admin") {
      return redirect("/admin");
    }

    if (user.role === "teacher") {
      return redirect("/teacher");
    }

    return redirect("/student");
  }

  return null;
};

const router = createBrowserRouter([
  {
    path: "/",
    Component: SigninPage,
    loader: nonAuthLoader,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    loader: adminAuthLoader,
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
      {
        path: "/admin/subjects",
        Component: AdminSubjectsPage,
      },
    ],
  },
  {
    path: "/teacher",
    Component: TeacherLayout,
    loader: teacherAuthLoader,
    children: [
      {
        path: "/teacher",
        Component: TeacherMainPage,
      },
      {
        path: "/teacher/journal",
        Component: JournalPage,
      },
      {
        path: "/teacher/messages",
        Component: TeacherChatsPage,
      },
    ],
  },
  {
    path: "/student",
    loader: studentAuthLoader,
    Component: StudentLayout,
    children: [
      {
        path: "/student",
        Component: StudentMainPage,
      },
      {
        path: "/student/journal",
        Component: StudentJournalPage,
      },
      {
        path: "/student/messages",
        Component: StudentChatsPage,
      },
    ],
  },
]);

const App = () => {
  const [contextState, setContextState] = useContext(AppContext);

  useEffect(() => {
    socket.on("connect", onConnect);

    return () => {
      socket.off("connect", onConnect);
    };
  }, []);

  const onConnect = () => {
    console.log("connect");
    initUserData();
  };

  const initUserData = async () => {
    const userId = AuthService.getUserId();
    if (!userId) {
      return;
    }

    const result = await UsersApi.getUser(userId);
    if (!result.success) {
      return;
    }
    socket.emit("user_data", { userId: result.user._id });
    setContextState((s) => ({ ...s, user: result.user }));
  };

  return <RouterProvider router={router} />;
};

export default App;
