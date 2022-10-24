import { observer } from "mobx-react-lite";
import { Link, useLoaderData } from "react-router-dom";
import { Category } from "../../Models/Ad";
import { CategoryForm } from "./CategoryForm";

export const CategoryDetail = observer(
  (props: { mode: "NEW" | "EDIT" | "VIEW" }) => {
    const category: Category = useLoaderData() as Category;
    return (
      <section className="w-full md:min-w-[600px] md:w-[80%]">
        <div className="flex justify-between  w-full border-b-2 border-sky-200">
          <h2 className="text-2xl">
            <Link to="/admin/categories">Categories</Link>
            {category?.id && (
              <Link to={`/admin/categories/${category.id}`}>
                / {category.title}
              </Link>
            )}
          </h2>

          {props.mode === "VIEW" && (
            <Link to={`/admin/categories/${category.id}/edit`}>
              <span className="material-symbols-outlined">edit</span>
            </Link>
          )}
          {props.mode === "EDIT" && (
            <Link to={`/admin/categories/${category.id}`}>
              <span className="material-symbols-outlined">close</span>
            </Link>
          )}
          {props.mode === "NEW" && (
            <Link to={`/admin/categories`}>
              <span className="material-symbols-outlined">close</span>
            </Link>
          )}
        </div>

        {props.mode === "VIEW" && (
          <>
            <h3 className="text-xl font-bold">{category.title}</h3>
            <p className="">{category.description}</p>
          </>
        )}
        {props.mode === "EDIT" && <CategoryForm category={category} />}
        {props.mode === "NEW" && <CategoryForm />}
      </section>
    );
  }
);
