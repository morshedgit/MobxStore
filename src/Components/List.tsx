import * as React from "react";
import { observer } from "mobx-react-lite";
import { AConstructorTypeOf, factory, Store } from "../Models/Store";
import { ListItem } from "./ListItem";
type ListProps<T extends { id: string; type: string }> = {
  store: Store<T>;
  constructor: AConstructorTypeOf<T>;
};
export const List = observer(
  <T extends { id: string; type: string }>(props: ListProps<T>) => {
    const handleAddItem = () => {
      props.store.addItem();
    };
    return (
      <ul className="w-full">
        {props.store.items.map((item) => {
          return <ListItem key={item.id} listItem={item} />;
        })}
        <button key="newItem" type="button" onClick={handleAddItem}>
          Add
        </button>
      </ul>
    );
  }
);
