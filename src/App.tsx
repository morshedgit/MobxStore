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
          if (!currentUser.isAuthorized) {
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
        path: "login",
        element: <Login />,
        action: async ({ request }) => {
          debugger;
          const formData = await request.formData();
          const { username, password } = Object.fromEntries(formData) as {
            username: string;
            password: string;
          };

          if (username && password) {
            await currentUser.login({ username, password });
            return redirect(`/cars`);
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
