import * as React from "react";
import { observer } from "mobx-react-lite";
import { School } from "../Models/School";

type SchoolViewProps = {
  school: School;
};
export const SchoolView = observer(
  (props: SchoolViewProps) => {
    const [editable, setEditable] = React.useState(false);
      const school = props.school
      const handleSubmitForm:
        | React.FormEventHandler<HTMLFormElement>
        | undefined = (e) => {
        e?.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        school.update(data.brand as string, data.model as string);
        setEditable(false);
      };
      return (
        <li className="w-full flex justify-between">
          <section className="flex flex-col">
            <p>
              created at: {school.createdAt}
            </p>
            {!editable && (
              <>
                <h3 className="text-xl font-bold">{school.name}</h3>
                <h3 className="text-xl font-bold">{school.info}</h3>
              </>
            )}
            {editable && (
              <form onSubmit={handleSubmitForm}>
                <input placeholder="name" type="text" name="name" />
                <input placeholder="info" type="text" name="info" />
                <button
                  className="p-2 border border-solid rounded-lg"
                  type="submit"
                >
                  Save
                </button>
              </form>
            )}
          </section>
          <section>
            <button
              className="p-2 border border-solid rounded-lg"
              type="button"
              onClick={() => setEditable((v) => !v)}
            >
              Edit
            </button>
            <button
              className="p-2 border border-solid rounded-lg"
              type="button"
              onClick={() => school.delete()}
            >
              Delete
            </button>
          </section>
        </li>
      );
    }
);
