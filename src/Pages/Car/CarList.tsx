import { List } from "../../Components/List";
import { carStore } from "../../Stores/Store";

export const CarList = () => {
  return <List store={carStore} />;
};
