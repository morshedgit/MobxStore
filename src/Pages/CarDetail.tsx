import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Car } from "../Models/Car";

export const CarDetail = ()=>{
    const [editable, setEditable] = useState(false);


    const car:Car = useLoaderData() as Car

    const handleSubmitForm:
        | React.FormEventHandler<HTMLFormElement>
        | undefined = (e) => {
        e?.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        car.update(data.brand as string, data.model as string);
        setEditable(false);
      };
    return (<section>
        <h2>Car Details</h2>
        
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
      </section>)
}