import * as React from "react";
import { observer } from "mobx-react-lite";
import { Car } from "../Models/Car";

type CarViewProps = {
  car: Car;
};
export const CarView = observer(
  (props: CarViewProps) => {
    const [editable, setEditable] = React.useState(false);
      const car = props.car
      const handleSubmitForm:
        | React.FormEventHandler<HTMLFormElement>
        | undefined = (e) => {
        e?.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        car.update(data.brand as string, data.model as string);
        setEditable(false);
      };
      return (
        <li className="w-full flex justify-between">
          <section className="flex flex-col">
            <p>
              created at: {car.createdAt}
              <button
                type="button"
                onClick={() => {
                  car.like(!car.liked);
                }}
              >
                {car.liked ? "♥" : "♡"}
              </button>
            </p>
            {!editable && (
              <>
                <h3 className="text-xl font-bold">{car.brand}</h3>
                <h3 className="text-xl font-bold">{car.model}</h3>
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
              onClick={() => car.delete()}
            >
              Delete
            </button>
          </section>
        </li>
      );
    }
);
