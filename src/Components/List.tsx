import { observer } from "mobx-react-lite";
import { Store } from "../Stores/Store";
import { CarView } from "./CarView";
import { Car } from "../Models/Car";
import { School } from "../Models/School";

export const List = observer(
  (props: {
    store: Store<Car> | Store<School>;
  }) => {
    const handleAddItem = () => {
      props.store.addItem();
    };
    return (
      <ul className="w-full">
        {props.store.items.map((item) => {
          switch(item.label){
            case 'Car':
              return <CarView key={Math.random()} car={item} />;
            case 'School':
              return <p>SchoolView</p>
          }
        })}
        <button key="newItem" type="button" onClick={handleAddItem}>
          Add
        </button>
      </ul>
    );
  }
);
