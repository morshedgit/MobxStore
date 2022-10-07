import * as React from "react";
import { observer } from "mobx-react-lite";
import { Store } from "../Models/Store";
import { ListItem } from "./ListItem";
import { IItem } from "../Services/IItem";

export const List = observer(
  <T extends IItem<T>>(props: {
    store: Store<T>;
  }) => {
    const handleAddItem = () => {
      props.store.addItem();
    };
    return (
      <ul className="w-full">
        {props.store.items.map((item) => {
          return <ListItem key={Math.random()} listItem={item} />;
        })}
        <button key="newItem" type="button" onClick={handleAddItem}>
          Add
        </button>
      </ul>
    );
  }
);
