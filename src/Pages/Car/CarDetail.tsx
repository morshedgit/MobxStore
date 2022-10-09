import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { Car } from "../../Models/Car";

export const CarDetail = observer(() => {
  const [editable, setEditable] = useState(false);

  const car: Car = useLoaderData() as Car;

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
    <section className="w-full md:min-w-[600px] md:w-[80%]">
      <div className="flex justify-between  w-full border-b-2 border-sky-200">
        <h2 className="text-2xl">
          <Link to="/cars">Cars</Link>/{" "}
          <Link to={`/cars/${car.id}`}>
            {car.brand || car.model ? `${car.brand} ${car.model}` : car.id}
          </Link>
          <button
            type="button"
            onClick={() => {
              car.like(!car.liked);
            }}
          >
            {car.liked ? "♥" : "♡"}
          </button>
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
          <h3 className="text-xl font-bold">{car.brand}</h3>
          <h3 className="text-xl font-bold">{car.model}</h3>
        </>
      )}
      {editable && (
        <form onSubmit={handleSubmitForm} className="p-4">
          <input placeholder="brand" type="text" name="brand" />
          <input placeholder="model" type="text" name="model" />
          <button className="p-2 border border-solid rounded-lg" type="submit">
            Save
          </button>
        </form>
      )}
    </section>
  );
});
