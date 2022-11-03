import { observer } from "mobx-react-lite";
import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Category } from "../../Models/Ad";
import { Store } from "../../Models/Common";
import { format } from "date-fns";

export const CategoriesPage = observer(() => {
  const location = useLocation();
  const isHidden = location.pathname.match(/.*\/categories\/.+/);
  const navigate = useNavigate();
  const categoryStore = useLoaderData() as Store<Category>;
  return (
    <section className="flex gap-x-4">
      <div
        className={`flex-grow flex-col ${isHidden ? "hidden" : "flex"} md:flex`}
      >
        <h2 className="text-2xl w-full border-b-2 border-sky-200 flex items-center justify-between">
          <Link to="/categories">Categories</Link>
          <Link to="/categories/new">
            <span className="material-symbols-outlined">add</span>
          </Link>
        </h2>

        <ul className="w-full flex flex-col gap-y-4">
          {categoryStore.items.map((item) => (
            <li key={item.id}>
              <NavLink
                to={`${item.id}`}
                className="w-full flex justify-between p-2 rounded-md shadow-sm shadow-gray-400"
              >
                <div>
                  <small className="flex items-center gap-x-2 min-w-[300px]">
                    {" "}
                    <span className="material-symbols-outlined text-sm">
                      auto_fix_high
                    </span>
                    <i>{format(new Date(item.createdAt), "MMMM dd, yyyy")}</i>
                    {item.creator ? (
                      <span className="flex gap-2 items-center">
                        <span className="material-symbols-outlined">
                          person
                        </span>
                        <p>{item.creator.username}</p>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          item.getCreator();
                        }}
                      >
                        <span className="material-symbols-outlined">
                          person
                        </span>
                      </button>
                    )}
                  </small>
                  <div className="flex gap-x-2">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                  </div>
                </div>

                <button
                  type="button"
                  className="hover:text-red-500"
                  onClick={async (e) => {
                    e.preventDefault();
                    await categoryStore.deleteItem(item);
                    navigate("/categories");
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
