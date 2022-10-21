import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { Category } from "../../Models/Ad";

export const CategoryDetail = observer(() => {
  const [editable, setEditable] = useState(false);

  const category: Category = useLoaderData() as Category;

  const handleSubmitForm:
    | React.FormEventHandler<HTMLFormElement>
    | undefined = (e) => {
    e?.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    debugger;
    category.update(data.catTitle as string);
    setEditable(false);
  };
  return (
    <section className="w-full md:min-w-[600px] md:w-[80%]">
      <div className="flex justify-between  w-full border-b-2 border-sky-200">
        <h2 className="text-2xl">
          <Link to="/admin/categories">Categorys</Link>/{" "}
          <Link to={`/admin/categories/${category.id}`}>{category.title}</Link>
        </h2>

        {!editable && (
          <button
            className="p-1 border border-solid rounded-lg h-fit text-xs"
            type="button"
            onClick={() => setEditable((v) => !v)}
          >
            Edit
          </button>
        )}
        {editable && (
          <button
            className="p-1 border border-solid rounded-lg h-fit text-xs"
            type="button"
            onClick={() => setEditable((v) => !v)}
          >
            Cancel
          </button>
        )}
      </div>

      {!editable && (
        <>
          <h3 className="text-xl font-bold">{category.title}</h3>
        </>
      )}
      {editable && (
        <form onSubmit={handleSubmitForm} className="flex gap-2 p-4">
          <input
            className="form-input"
            placeholder="title"
            type="text"
            name="catTitle"
          />
          <button className="btn-primary" type="submit">
            Save
          </button>
        </form>
      )}
    </section>
  );
});
