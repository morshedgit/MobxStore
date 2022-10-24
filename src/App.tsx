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
import { categoryStore, userStore } from "./Services/stores";
import { UserPage } from "./Pages/Users/UserPage";
import { UserDetail } from "./Pages/Users/UserDetail";

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
    loader: async () => {
      const isLogged = await currentUser.isAuthenticated();
      if (!isLogged) {
        return redirect("/auth/login?returnUrl=/");
      }
    },
  },
  {
    path: "admin",
    element: <AdminLayout />,
    errorElement: <h1 className="text-7xl">ERROR: 404</h1>,
    children: [
      {
        index: true,
        element: <Navigate to="categories" />,
      },
      {
        path: "users",
        element: <UserPage store={userStore} />,
        children: [
          {
            errorElement: <h1 className="text-7xl">ERROR: 404</h1>,
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
                  user.update({
                    username: data.username as string,
                  });
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
      {
        path: "categories",
        element: <CategoriesPage store={categoryStore} />,
        children: [
          {
            errorElement: <h1 className="text-7xl">ERROR: 404</h1>,
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
                    title: data.catTitle as string,
                    description: data.catDescription as string,
                  });
                  return redirect(`/admin/categories/${id}`);
                },
              },
              {
                path: "new",
                element: <CategoryDetail mode="NEW" />,
                action: async ({ request }) => {
                  const formData = await request.formData();
                  const { catTitle, catDescription } = Object.fromEntries(
                    formData
                  ) as {
                    catTitle: string;
                    catDescription: string;
                  };
                  const newCategory = new Category();
                  newCategory.title = catTitle;
                  newCategory.description = catDescription;
                  newCategory.owner = currentUser.id;
                  await categoryStore.createItem(newCategory);

                  return redirect(`/admin/categories/${newCategory.id}`);
                },
              },
            ],
          },
        ],
      },
    ],
    loader: async () => {
      const isLogged = await currentUser.isAuthenticated();
      if (!isLogged) {
        return redirect("/auth/login?returnUrl=/admin");
      }
    },
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
    loader: async ({ request }) => {
      const urlSearchParams = new URLSearchParams(request.url);
      const returnUrl = urlSearchParams.get("returnUrl");
      const isLogged = await currentUser.isAuthenticated();
      if (isLogged) {
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
