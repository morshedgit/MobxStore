import { Form, Link, NavLink, Outlet, useParams } from "react-router-dom";
import { Category } from "../../Models/Ad";
import { Store } from "../../Models/Common";

export const CategoriesPage = ({ store }: { store: Store<Category> }) => {
  const { id } = useParams();
  return (
    <section className="flex gap-x-4">
      <div className={`flex-grow flex-col ${id ? "hidden" : "flex"} md:flex`}>
        <h2 className="text-2xl w-full border-b-2 border-sky-200">
          <Link to="categories">Categories</Link>
        </h2>

        <ul className="w-full">
          {store.items.map((item) => (
            <li key={item.id}>
              <NavLink
                to={`${item.id}`}
                className="w-full flex justify-between"
              >
                <div>
                  <div className="flex gap-x-2">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                  </div>
                  <small>Created at: {item.createdAt}</small>
                </div>
              </NavLink>
            </li>
          ))}
          <Form method="post" className="flex flex-col gap-2">
            <fieldset>
              <label htmlFor="catTitle">Title</label>
              <input
                type="text"
                id="catTitle"
                defaultValue={undefined}
                name="catTitle"
                className="form-input"
              />
            </fieldset>
            <button key="newItem" type="submit" className="btn-primary">
              Add
            </button>
          </Form>
        </ul>
      </div>
      <Outlet />
    </section>
  );
};
