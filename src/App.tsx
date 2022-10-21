import "./App.css";
import React from "react";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";

import { currentUser } from "./Models/User";
import { MainLayout } from "./Layouts/MainLayout";
import { AdminLayout } from "./Layouts/AdminLayout";
import { AuthLayout } from "./Layouts/AuthLayout";
import { Login } from "./Pages/Auth/Login";
import { ForgetPassword } from "./Pages/Auth/Forgetpassword";
import { Signup } from "./Pages/Auth/Signup";
import { CategoriesPage } from "./Pages/Category/CategoriesPage";
import { Category, categoryStore } from "./Models/Ad";
import { CategoryDetail } from "./Pages/Category/CategoryDetail";
import { ERROR_CODES } from "./Models/Common";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <h1 className="text-7xl">ERROR: 404</h1>,
    children: [
      {
        index: true,
        element: <h2 className="text-2xl">Home Page</h2>,
      },
    ],
  },
  {
    path: "admin",
    element: <AdminLayout />,
    errorElement: <h1 className="text-7xl">ERROR: 404</h1>,
    children: [
      {
        index: true,
        element: <h2 className="text-2xl">Home Page</h2>,
      },
      {
        path: "categories",
        element: <CategoriesPage store={categoryStore} />,
        children: [
          {
            errorElement: <h1 className="text-7xl">ERROR: 404</h1>,
            children: [
              {
                path: "/admin/categories/:id",
                element: <CategoryDetail />,
                loader: async ({ params }) => {
                  debugger;
                  if (!params.id) throw Error(ERROR_CODES.Param_Not_Found);
                  const result = await categoryStore.getItem(params.id);
                  result.store = categoryStore;
                  return result;
                },
              },
            ],
          },
        ],
        // loader: () => {
        //   if (!currentUser.authenticated) {
        //     return redirect(`/auth/login?returnUrl=/cars`);
        //   }
        // },
        action: async ({ request }) => {
          const formData = await request.formData();
          const { catTitle } = Object.fromEntries(formData) as {
            catTitle: string;
          };
          const newCategory = new Category();
          newCategory.title = catTitle;
          await categoryStore.createItem(newCategory);
          return;
        },
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <h1 className="text-7xl">ERROR: 404</h1>,
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
        element: <Login />,
        action: async ({ request }) => {
          const formData = await request.formData();
          const { username, password } = Object.fromEntries(formData) as {
            username: string;
            password: string;
          };

          if (username && password) {
            try {
              await currentUser.login({ username, password });
              const urlSearchParams = new URLSearchParams(request.url);
              const returnUrl = urlSearchParams.get("returnUrl");
              debugger;
              const redirectPath = `${returnUrl ?? ""}`;
              return redirect(redirectPath);
            } catch (e: any) {
              alert(e.message);
            }
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
    loader: ({ request }) => {
      const urlSearchParams = new URLSearchParams(request.url);
      const returnUrl = urlSearchParams.get("returnUrl");
      if (currentUser.authenticated) {
        if (!returnUrl) return redirect("/");
        return redirect(`/${returnUrl}`);
      }
    },
  },
]);
function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
