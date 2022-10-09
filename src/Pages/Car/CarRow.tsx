import { observer } from "mobx-react-lite";
import { Car } from "../../Models/Car";
import { NavLink, useNavigate } from "react-router-dom";

type CarRowProps = {
  car: Car;
};
export const CarRow = observer((props: CarRowProps) => {
  const navigate = useNavigate();
  const car = props.car;
  const handleDelete: React.MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    e.preventDefault();
    await car.delete();
    navigate(`/cars`);
  };
  return (
    <ul className="flex flex-col py-1 border-0 border-b-4">
      <NavLink to={`${car.id}`} className="w-full flex justify-between">
        <div>
          <div className="flex gap-x-2">
            <h3 className="text-xl font-bold">{car.brand}</h3>
            <h3 className="text-xl font-bold">{car.model}</h3>
          </div>
          <small>Created at: {car.createdAt}</small>
        </div>
        <button
          className="p-2 border border-solid rounded-lg h-fit hover:bg-red-500 hover:text-red-50"
          type="button"
          onClick={handleDelete}
        >
          Delete
        </button>
      </NavLink>
    </ul>
  );
});
