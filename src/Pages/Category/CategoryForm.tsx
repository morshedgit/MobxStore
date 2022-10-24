import { Form } from "react-router-dom";
import { Category } from "../../Models/Ad";

export const CategoryForm = (props: { category?: Category }) => {
  return (
    <Form method="post" className="flex flex-col gap-2 p-4">
      <section>
        <input hidden name="catID" defaultValue={props.category?.id} />
        <fieldset>
          <label htmlFor="catTitle">Title</label>
          <input
            type="text"
            id="catTitle"
            defaultValue={props.category?.title}
            name="catTitle"
            className="form-input"
            required
          />
        </fieldset>
        <fieldset>
          <label htmlFor="catDescription">Description</label>
          <input
            type="text"
            id="catDescription"
            defaultValue={props.category?.description}
            name="catDescription"
            className="form-input"
            required
          />
        </fieldset>
      </section>
      <button className="btn-primary" type="submit">
        Save
      </button>
    </Form>
  );
};
