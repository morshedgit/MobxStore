import { observer } from "mobx-react-lite";
import { Store } from "../Stores/Store";
import { CarView } from "./CarView";
import { Car } from "../Models/Car";
import { School } from "../Models/School";
import { useNavigate } from "react-router-dom";

export const List = observer((props: { store: Store<Car> | Store<School> }) => {
  const navigate = useNavigate();
  const handleAddItem = async () => {
    const item = await props.store.addItem();
    debugger;
    navigate(`${item.id}`);
  };
  return (
    <ul className="w-full">
      {props.store.items.map((item) => {
        switch (item.label) {
          case "Car":
            return <CarView key={Math.random()} car={item} />;
          case "School":
            return <p>SchoolView</p>;
        }
      })}
      <button
        key="newItem"
        type="button"
        onClick={handleAddItem}
        className="border-2 rounded-lg m-2 px-4"
      >
        Add
      </button>
    </ul>
  );
});
