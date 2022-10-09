import "./App.css";
import React from "react";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";

import { carStore } from "./Stores/Store";
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
          return redirect(`/auth/login`);
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
      },
      {
        path: "forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "signup",
        element: <Signup />,
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
