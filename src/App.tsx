import './App.css'
import React from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import {List } from "./Components/List"
import {carStore, schoolStore} from "./Stores/Store"
import { MainLayout } from './Layouts/MainLayout';
import { CarDetail } from './Pages/CarDetail';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout/>,
    errorElement:<h1>ERROR:404</h1>,
    children:[
      {
        index:true,
        element:<h2 className='text-2xl'>Home Page</h2>
      },
      {
        path: "cars",
        element: <section>
          <div>

          <h2 className='text-2xl'>Cars Page</h2>
          <List store={carStore}/>
          </div>
          <Outlet />
        </section>,
        children:[
          {
            path:":id",
            element:<CarDetail />,
            loader:({params})=>{
              if(!params.id) throw Error("Param Not Found")
              return carStore.getItem(params.id)
            }
          }
        ]
      },
      {
        path: "schools",
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
