import * as React from "react";
import { observer } from "mobx-react-lite";
import { Car } from "../Models/Car";
import { IItem } from "../Services/IItem";

type ListItemProps<T> = {
  listItem: T;
};
export const ListItem = observer(
  <T extends IItem<T>>(props: ListItemProps<T>) => {
    const [editable, setEditable] = React.useState(false);
    if (props.listItem.label === "Car") {
      const listItem = (props.listItem as unknown) as Car;
      const handleSubmitForm:
        | React.FormEventHandler<HTMLFormElement>
        | undefined = (e) => {
        e?.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        listItem.update(data.brand as string, data.model as string);
        setEditable(false);
      };
      return (
        <li className="w-full flex justify-between">
          <section className="flex flex-col">
            <p>
              {listItem.id}
              <button
                type="button"
                onClick={() => {
                  listItem.like(!listItem.liked);
                }}
              >
                {listItem.liked ? "♥" : "♡"}
              </button>
            </p>
            {!editable && (
              <>
                <h3 className="text-xl font-bold">{listItem.brand}</h3>
                <h3 className="text-xl font-bold">{listItem.model}</h3>
              </>
            )}
            {editable && (
              <form onSubmit={handleSubmitForm}>
                <input placeholder="brand" type="text" name="brand" />
                <input placeholder="model" type="text" name="model" />
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
              onClick={() => listItem.delete()}
            >
              Delete
            </button>
          </section>
        </li>
      );
    }
    return (
      <li>
        <h3 className="text-xl font-bold">{(props.listItem as any).id}</h3>
      </li>
    );
  }
);
