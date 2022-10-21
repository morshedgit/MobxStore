import { observer } from "mobx-react-lite";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export const Sidebar = observer(()=>{
    
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
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? "underline" : "")}
                  end
                >
                  {open ? (
                    "Home"
                  ) : (
                    <span className="material-symbols-outlined">home</span>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/cars"
                  className={({ isActive }) => (isActive ? "underline" : "")}
                >
                  {open ? (
                    "Cars"
                  ) : (
                    <span className="material-symbols-outlined">
                      local_shipping
                    </span>
                  )}
                </NavLink>
              </li>
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
              <span className="material-symbols-outlined">
                arrow_forward_ios
              </span>
            )}
          </button>
        </aside>
    )
})