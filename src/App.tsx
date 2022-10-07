import * as React from "react";
import "./styles.css";
import { List } from "./Components/List";

import { carStore } from "./Models/Store";
import { Car } from "./Models/Car";

export default function App() {
  return (
    <div className="App bg-blue-300 flex flex-col items-start px-10">
      <h1 className="text-6xl">My Store</h1>
      <List store={carStore} constructor={Car} />
    </div>
  );
}
