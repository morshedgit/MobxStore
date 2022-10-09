import { Outlet } from "react-router-dom";
import { Header } from "./Header";
export const AuthLayout = () => {
  return (
    <div className={`w-screen h-screen flex flex-col`}>
      <Header />
      <div className="w-full flex-grow flex">
        <main className="p-2 w-full h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
