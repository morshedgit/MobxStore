import { makeAutoObservable } from "mobx";
import { IItem } from "../Services/IItem";
import { Store } from "../Stores/Store";

export class User implements IItem<User> {
  id: string;
  label: "User" = "User";
  isOn = false;
  store: Store<User>;
  constructor(
    store: Store<User>,
    itemId?: string,
    public createdAt?: string,
    public name?: string,
    public type?: string
  ) {
    makeAutoObservable(this);
    this.store = store;
    this.id = itemId ?? Math.random().toString(32);
    this.createdAt = new Date().toUTCString();
  }

  async update(name: string, type: string) {
    this.name = name;
    this.type = type;
    await this.store.updateItem(this);
  }

  async setOnStatus(v: boolean) {
    this.isOn = v;
    await this.store.updateItem(this);
  }

  async delete() {
    try {
      await this.store.deleteItem(this);

      console.log("Success");
    } catch {
      console.log("error");
    }
  }

  fromJson(json?: User) {
    const newUser = new User(this.store);
    if (!json) {
      return newUser;
    }
    newUser.id = json.id;
    newUser.label = json.label;
    newUser.isOn = json.isOn;
    newUser.name = json.name;
    newUser.type = json.type;
    newUser.createdAt = json.createdAt;
    return newUser;
  }

  toJson() {
    return {
      id: this.id,
      label: this.label,
      isOn: this.isOn,
      name: this.name,
      type: this.type,
      createdAt: this.createdAt,
    };
  }
}
