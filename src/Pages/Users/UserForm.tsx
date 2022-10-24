import { Form } from "react-router-dom";
import { User } from "../../Models/Common";

export const UserForm = (props: { user?: User }) => {
  return (
    <Form method="post" className="flex flex-col gap-2 p-4">
      <section>
        <input hidden name="userID" defaultValue={props.user?.id} />
        <fieldset>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            defaultValue={props.user?.username}
            name="username"
            className="form-input"
            required
          />
        </fieldset>
        <fieldset>
          {/* <label htmlFor="catDescription">Description</label> */}
          {/* <input
            type="checkbox"
            id="catDescription"
            defaultValue={props.user?.authenticated}
            name="catDescription"
            className="form-input"
            required
          /> */}
        </fieldset>
      </section>
      <button className="btn-primary" type="submit">
        Save
      </button>
    </Form>
  );
};
