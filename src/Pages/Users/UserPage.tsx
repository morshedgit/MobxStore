import { observer } from "mobx-react-lite";
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useParams,
} from "react-router-dom";
import { User } from "../../Models/Common";
import { Store } from "../../Models/Common";
import { format } from "date-fns";

export const UserPage = observer(({ store }: { store: Store<User> }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <section className="flex gap-x-4">
      <div className={`flex-grow flex-col ${id ? "hidden" : "flex"} md:flex`}>
        <h2 className="text-2xl w-full border-b-2 border-sky-200 flex items-center justify-between">
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/users/new">
            <span className="material-symbols-outlined">add</span>
          </Link>
        </h2>

        <ul className="w-full flex flex-col gap-y-4">
          {store.items.map((user) => (
            <li key={user.id}>
              <NavLink
                to={`${user.id}`}
                className="w-full flex justify-between p-2 rounded-md shadow-sm shadow-gray-400"
              >
                <div>
                  <small className="flex items-center gap-x-2">
                    {" "}
                    <span className="material-symbols-outlined text-sm">
                      auto_fix_high
                    </span>
                    <i>{format(new Date(user.createdAt), "MMMM dd, yyyy")}</i>
                  </small>
                  <div className="flex gap-x-2">
                    <h3 className="text-xl font-bold">{user.username}</h3>
                  </div>
                </div>

                <button
                  type="button"
                  className="hover:text-red-500"
                  onClick={async (e) => {
                    e.preventDefault();
                    await store.deleteItem(user);
                    navigate("/admin/users");
                  }}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <Outlet />
    </section>
  );
});
