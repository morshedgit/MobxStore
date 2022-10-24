import { observer } from "mobx-react-lite";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Category } from "../../Models/Ad";
import { Store } from "../../Models/Common";
import { format } from "date-fns";

export const CategoriesPage = observer(
  ({ store }: { store: Store<Category> }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    return (
      <section className="flex gap-x-4">
        <div className={`flex-grow flex-col ${id ? "hidden" : "flex"} md:flex`}>
          <h2 className="text-2xl w-full border-b-2 border-sky-200 flex items-center justify-between">
            <Link to="/admin/categories">Categories</Link>
            <Link to="/admin/categories/new">
              <span className="material-symbols-outlined">add</span>
            </Link>
          </h2>

          <ul className="w-full flex flex-col gap-y-4">
            {store.items.map((item) => (
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
                      {typeof item.owner === "string" ? (
                        <button type="button" onClick={() => item.getOwner()}>
                          <span className="material-symbols-outlined">
                            person
                          </span>
                        </button>
                      ) : (
                        <button type="button">
                          <span className="material-symbols-outlined">
                            person
                          </span>
                          <p>{item.owner.username}</p>
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
                      await store.deleteItem(item);
                      navigate("/admin/categories");
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
  }
);
