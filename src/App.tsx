import "./App.css";
import React from "react";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";

import { carStore } from "./Stores/Store";
import { currentUser } from "./Models/User";
import { MainLayout } from "./Layouts/MainLayout";
import { CarDetail } from "./Pages/Car/CarDetail";
import { CarsPage } from "./Pages/Car/CarsPage";
import { AuthLayout } from "./Layouts/AuthLayout";
import { Login } from "./Pages/Auth/Login";
import { ForgetPassword } from "./Pages/Auth/Forgetpassword";
import { Signup } from "./Pages/Auth/Signup";

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
      {
        path: "cars",
        element: <CarsPage store={carStore} />,
        children: [
          {
            errorElement: <h1 className="text-7xl">ERROR: 404</h1>,
            children: [
              {
                path: "/cars/:id",
                element: <CarDetail />,
                loader: ({ params }) => {
                  if (!params.id) throw Error("Param Not Found");
                  return carStore.getItem(params.id);
                },
              },
            ],
          },
        ],
        loader: () => {
          if (!currentUser.authenticated) {
            return redirect(`/auth/login?returnUrl=/cars`);
          }
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
