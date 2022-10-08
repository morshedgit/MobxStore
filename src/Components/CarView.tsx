import * as React from "react";
import { observer } from "mobx-react-lite";
import { Car } from "../Models/Car";
import { NavLink } from "react-router-dom";

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
        <NavLink to={`${car.id}`} className="w-full flex justify-between">
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
        </NavLink>
      );
    }
);
