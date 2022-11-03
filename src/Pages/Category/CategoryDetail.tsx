import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { Category } from "../../Models/Ad";
import { CategoryForm } from "./CategoryForm";

export const CategoryDetail = observer(
  (props: { mode: "NEW" | "EDIT" | "VIEW" }) => {
    const category: Category = useLoaderData() as Category;

    useEffect(() => {
      category?.getCreator();
    }, []);

    return (
      <section className="w-full md:w-[80%]">
        <div className="flex justify-between  w-full border-b-2 border-sky-200">
          <h2 className="text-2xl">
            <Link to="/categories">Categories</Link>
            {category?.id && (
              <Link to={`/categories/${category.id}`}>/ {category.title}</Link>
            )}
          </h2>

          {props.mode === "VIEW" && (
            <Link to={`/categories/${category.id}/edit`}>
              <span className="material-symbols-outlined">edit</span>
            </Link>
          )}
          {props.mode === "EDIT" && (
            <Link to={`/categories/${category.id}`}>
              <span className="material-symbols-outlined">close</span>
            </Link>
          )}
          {props.mode === "NEW" && (
            <Link to={`/categories`}>
              <span className="material-symbols-outlined">close</span>
            </Link>
          )}
        </div>

        {props.mode === "VIEW" && (
          <>
            <small className="flex items-center gap-x-2 min-w-[300px]">
              {" "}
              <span className="material-symbols-outlined text-sm">
                auto_fix_high
              </span>
              <i>{format(new Date(category.createdAt), "MMMM dd, yyyy")}</i>
              {category.creator ? (
                <Link
                  to={`/admin/users/${category.creatorId}`}
                  className="flex gap-2 items-center"
                >
                  <span className="material-symbols-outlined">person</span>
                  <p>{category.creator.username}</p>
                </Link>
              ) : (
                <span className="material-symbols-outlined">pending</span>
              )}
            </small>
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
