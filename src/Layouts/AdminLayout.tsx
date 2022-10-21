import { observer } from "mobx-react-lite";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
export const AdminLayout = observer(() => {
  return (
    <div className={`w-screen h-screen flex flex-col`}>
      <Header />
      <div className="w-full flex-grow flex">
        <Sidebar />
        <main className="p-2 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
});
