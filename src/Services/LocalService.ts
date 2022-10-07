import { IService } from "./IService";
import { IItem } from "./IItem";
import { TypeConstructor } from "../Stores/Store";

function replacer(key: string, value: unknown) {
  if (key === "store") return undefined;
  else return value;
}
export class LocalService<T extends IItem<T>> implements IService<T> {
  storeName: string;
  itemFactory:T
  items: T[] = [];
  constructor(private factory: TypeConstructor<T>) {
    this.itemFactory = new this.factory()
    this.storeName = this.itemFactory.label;
    this.fetchAll().then((items) => {
      items.map((item) => {
        const newItem = this.itemFactory.fromJson(item);
        this.items.push(newItem);
      });
    });
  }
  async create(item: T) {
    const newItem = item.toJson();
    await localStorage.setItem(
      this.storeName,
      JSON.stringify([...this.items, newItem], replacer)
    );
    this.items.push(item);
    return item;
  }
  async read(id: string) {
    return this.items.find((item) => item.id === id);
  }
  async update(item: T) {
    const updatedItem = this.items.find((m) => m.id === item.id);
    if (!updatedItem) throw Error("NOT FOUND");
    const updatedItems = this.items.map((m) => {
      if (m.id === item.id) {
        return item;
      }
      return m;
    });
    const jsonFormattedUpdatedItems = updatedItems.map((m) => m.toJson());
    await localStorage.setItem(
      this.storeName,
      JSON.stringify(jsonFormattedUpdatedItems, replacer)
    );

    this.items = updatedItems;
    return item;
  }
  async delete(id: string) {
    const deletedItem = this.items.find((m) => m.id === id);
    if (!deletedItem) throw Error("NOT FOUND");
    const updatedItems = this.items.filter((m) => m.id !== id);

    const jsonFormattedUpdatedItems = updatedItems.map((m) => m.toJson());

    await localStorage.setItem(
      this.storeName,
      JSON.stringify(jsonFormattedUpdatedItems, replacer)
    );
    this.items = updatedItems;
    return deletedItem;
  }
  async fetchAll() {
    const stringifiedItems = localStorage.getItem(this.storeName);
    if (stringifiedItems) {
      return JSON.parse(stringifiedItems) as T[];
    }
    return [];
  }
  async getAll() {
    return this.items;
  }
}
