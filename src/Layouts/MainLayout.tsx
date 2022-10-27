import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
export const MainLayout = observer(() => {
  const [showSideMenu, setShowSideMenu] = useState(false);
  return (
    <div className={`w-screen h-screen flex flex-col`}>
      <Header onMenuToggle={() => setShowSideMenu((v) => !v)} />
      <div className="w-full flex-grow flex">
        <section className={`${showSideMenu ? "flex" : "hidden"} md:flex`}>
          <Sidebar />
        </section>
        <main className="p-2 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
});
