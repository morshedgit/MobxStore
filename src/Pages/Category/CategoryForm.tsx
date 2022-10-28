import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Form } from "react-router-dom";
import { Category } from "../../Models/Ad";
import { userStore } from "../../Stores/stores";

export const CategoryForm = observer((props: { category?: Category }) => {
  useEffect(() => {
    props.category?.getOwner();
  }, [props.category]);
  return (
    <Form method="post" className="flex flex-col gap-2 p-4">
      <section>
        <input hidden name="catID" defaultValue={props.category?.id} />
        <fieldset>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            defaultValue={props.category?.title}
            name="title"
            className="form-input"
            required
          />
        </fieldset>
        <fieldset>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            defaultValue={props.category?.description}
            name="description"
            className="form-input"
            required
          />
        </fieldset>
        {props.category?.author && (
          <fieldset>
            <label htmlFor="ownerId">Owner</label>
            <select
              id="ownerId"
              defaultValue={props.category.author.id}
              name="ownerId"
              className="form-input"
              required
            >
              {userStore.items.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </fieldset>
        )}
      </section>
      <button className="btn-primary" type="submit">
        Save
      </button>
    </Form>
  );
});
