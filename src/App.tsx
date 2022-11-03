import "./App.css";
import React from "react";
import {
  createBrowserRouter,
  Navigate,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { MainLayout } from "./Layouts/MainLayout";
import { AdminLayout } from "./Layouts/AdminLayout";
import { AuthLayout } from "./Layouts/AuthLayout";
import { Login } from "./Pages/Auth/Login";
import { ForgetPassword } from "./Pages/Auth/Forgetpassword";
import { Signup } from "./Pages/Auth/Signup";
import { CategoriesPage } from "./Pages/Category/CategoriesPage";
import { Category } from "./Models/Ad";
import { CategoryDetail } from "./Pages/Category/CategoryDetail";
import { ERROR_CODES, User } from "./Models/Common";
import { currentUser } from "./Models/User";
import { categoryStore, userStore } from "./Stores/stores";
import { UserPage } from "./Pages/Users/UserPage";
import { UserDetail } from "./Pages/Users/UserDetail";
import ErrorPage from "./Pages/Error/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <h2 className="text-2xl">Home Page</h2>,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
        children: [
          {
            errorElement: <ErrorPage />,
            children: [
              {
                path: ":id",
                element: <CategoryDetail mode="VIEW" />,
                loader: async ({ params }) => {
                  if (!params.id && params.id !== "new")
                    throw Error(ERROR_CODES.PARAM_NOT_FOUND);
                  const result = await categoryStore.getItem(params.id);
                  result.store = categoryStore;
                  return result;
                },
              },
              {
                path: ":id/edit",
                element: <CategoryDetail mode="EDIT" />,
                loader: async ({ params }) => {
                  if (!params.id) throw Error(ERROR_CODES.PARAM_NOT_FOUND);
                  const result = await categoryStore.getItem(params.id);

                  result.store = categoryStore;
                  return result;
                },
                action: async ({ request }) => {
                  const formData = await request.formData();
                  const data = Object.fromEntries(formData.entries());
                  const id = data.catID as string;
                  const category = await categoryStore.getItem(id);
                  category.update({
                    title: data.title as string,
                    description: data.description as string,
                    ownerId: data.ownerId as string,
                  });
                  return redirect(`/categories/${id}`);
                },
              },
              {
                path: "new",
                element: <CategoryDetail mode="NEW" />,
                action: async ({ request }) => {
                  const formData = await request.formData();
                  const { title, description } = Object.fromEntries(
                    formData
                  ) as {
                    title: string;
                    description: string;
                  };
                  const newCategory = new Category();
                  newCategory.title = title;
                  newCategory.description = description;
                  newCategory.creatorId = currentUser.id;
                  await categoryStore.createItem(newCategory);

                  return redirect(`/categories/${newCategory.id}`);
                },
              },
            ],
          },
        ],
        loader: async () => {
          await categoryStore.init();
          return categoryStore;
        },
      },
    ],
    // loader: async () => {
    //   const isLogged = await currentUser.isAuthenticated();
    //   if (!isLogged) {
    //     return redirect("/auth/login?returnUrl=/");
    //   }
    // },
  },
  {
    path: "admin",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="users" />,
      },
      {
        path: "users",
        element: <UserPage store={userStore} />,
        children: [
          {
            errorElement: <ErrorPage />,
            children: [
              {
                path: ":id",
                element: <UserDetail mode="VIEW" />,
                loader: async ({ params }) => {
                  if (!params.id && params.id !== "new")
                    throw Error(ERROR_CODES.PARAM_NOT_FOUND);
                  const result = await userStore.getItem(params.id);

                  result.store = userStore;
                  return result;
                },
              },
              {
                path: ":id/edit",
                element: <UserDetail mode="EDIT" />,
                loader: async ({ params }) => {
                  if (!params.id) throw Error(ERROR_CODES.PARAM_NOT_FOUND);
                  const result = await userStore.getItem(params.id);

                  result.store = userStore;
                  return result;
                },
                action: async ({ request }) => {
                  const formData = await request.formData();
                  const data = Object.fromEntries(formData.entries());
                  const id = data.userID as string;
                  const user = await userStore.getItem(id);
                  // user.update({
                  //   username: data.username as string,
                  // });
                  return redirect(`/admin/users/${id}`);
                },
              },
              {
                path: "new",
                element: <UserDetail mode="NEW" />,
                action: async ({ request }) => {
                  const formData = await request.formData();
                  const { username } = Object.fromEntries(formData) as {
                    username: string;
                  };
                  const newUser = new User();
                  newUser.username = username;
                  await userStore.createItem(newUser);

                  return redirect(`/admin/users/${newUser.id}`);
                },
              },
            ],
          },
        ],
      },
    ],
    loader: async () => {
      const isAuth = await currentUser.isAuthenticated();

      if (!isAuth) return redirect("/auth/login?returnUrl=/admin");

      const role = currentUser.role;
      if (!(role === "admin")) throw Error(ERROR_CODES.UNAUTHORIZED);
      return;
    },
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "logout",
        action: async () => {
          const returnUrl = window.location.pathname;
          await currentUser.logout();
          return redirect(
            `/auth/login/${returnUrl ? "?&returnUrl=" + returnUrl : ""}`
          );
        },
      },
      {
        path: "login",
        errorElement: <Login />,
        element: <Login />,
        action: async ({ request }) => {
          const formData = await request.formData();
          const { username, password } = Object.fromEntries(formData) as {
            username: string;
            password: string;
          };

          if (username && password) {
            await currentUser.login({ username, password });
            const urlSearchParams = new URLSearchParams(request.url);
            const returnUrl = urlSearchParams.get("returnUrl");
            const redirectPath = `${returnUrl ?? ""}`;
            return redirect(redirectPath);
          }
          return;
        },
      },
      {
        path: "forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "signup",
        errorElement: <Signup />,
        element: <Signup />,
        action: async ({ request }) => {
          const formData = await request.formData();
          const { username, password } = Object.fromEntries(formData) as {
            username: string;
            password: string;
          };

          if (username && password) {
            await currentUser.signup({ username, password });
            return redirect(`/auth/login`);
          }
          return;
        },
      },
    ],
    loader: async ({ request }) => {
      const urlSearchParams = new URLSearchParams(request.url);
      const returnUrl = urlSearchParams.get("returnUrl");
      const isAuth = await currentUser.isAuthenticated();
      if (!isAuth) return;
      if (!returnUrl) return redirect("/");
      return redirect(`/${returnUrl}`);
    },
  },
]);
function App() {
  document.title = import.meta.env.VITE_APP_TITLE;
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
