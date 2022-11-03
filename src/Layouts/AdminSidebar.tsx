import { observer } from "mobx-react-lite";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { currentUser } from "../Models/User";

export const AdminSidebar = observer(() => {
  const [open, setOpen] = useState(false);
  return (
    <aside
      className={`border p-2 bg-slate-300 text-slate-600 text-lg relative ${
        open ? "w-[10rem]" : "w-[4rem]"
      }
          } transition-[width]`}
    >
      <nav>
        <ul className={`flex flex-col ${open ? "" : "items-center"}`}>
          {currentUser.role === "admin" && (
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) => (isActive ? "underline" : "")}
                end
              >
                {open ? (
                  "Users"
                ) : (
                  <span className="material-symbols-outlined">group</span>
                )}
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="absolute bottom-2 right-[-1rem] w-8 h-8 rounded-full text-gray-50 bg-gray-700 flex items-center justify-center text-2xl"
      >
        {open ? (
          <span className="material-symbols-outlined">arrow_back_ios</span>
        ) : (
          <span className="material-symbols-outlined">arrow_forward_ios</span>
        )}
      </button>
    </aside>
  );
});
