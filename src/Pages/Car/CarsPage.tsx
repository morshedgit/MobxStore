import { Link, Outlet, useParams } from "react-router-dom";
import { List } from "../../Components/List";
import { Car } from "../../Models/Car";
import { Store } from "../../Stores/Store";

export const CarsPage = ({ store }: { store: Store<Car> }) => {
  const { id } = useParams();
  return (
    <section className="flex gap-x-4">
      <div className={`flex-grow flex-col ${id ? "hidden" : "flex"} md:flex`}>
        <h2 className="text-2xl w-full border-b-2 border-sky-200">
          <Link to="/cars">Cars</Link>
        </h2>
        <List store={store} />
      </div>
      <Outlet />
    </section>
  );
};
