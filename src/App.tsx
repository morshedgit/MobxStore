import './App.css'
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import {List } from "./Components/List"
import {carStore, schoolStore} from "./Stores/Store"
import { MainLayout } from './Layouts/MainLayout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout/>,
    errorElement:<h1>ERROR:404</h1>,
    children:[
      {
        path: "/cars",
        element: <List store={carStore}/>,
      },
      {
        path: "/schools",
        element: <List store={schoolStore}/>,
      },
    ]
  },
]);
function App() {
  
  return (

  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
  )

}

export default App
