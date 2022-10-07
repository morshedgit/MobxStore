import { makeAutoObservable, runInAction } from "mobx";
import { Car } from "./Car";
import { IService } from "../Services/IService";
import { LocalService } from "../Services/LocalService";
import { IItem } from "../Services/IItem";

// export type AConstructorTypeOf<T> = new (...args: any[]) => T;

// export function factory<T extends { id: string }>(
//   Ctor: AConstructorTypeOf<T>,
//   ...args: any[]
// ) {
//   return new Ctor(...args);
// }
export class Store<T> {
  items: T[] = [];
  constructor(private factory: T, private storageService: IService<T>) {
    makeAutoObservable(this);
    this.init();
  }

  async init() {
    try {
      const initialItems = await this.storageService.getAll();
      runInAction(() => {
        this.items = initialItems;
      });
    } catch {
      console.log("ERROR");
    }
  }

  getItems(): T[] {
    return [];
  }

  getItem(id: string) {
    return this.storageService.read(id);
  }

  async addItem(args?: unknown[]) {
    const newItem = this.factory.fromJson();

    await this.storageService.create(newItem);
    runInAction(() => (this.items = [...this.items, newItem]));
  }

  async deleteItem(item: T) {
    await this.storageService.delete(item.id);
    const updatedItems = this.items.filter((m) => item.id !== m.id);
    runInAction(() => (this.items = updatedItems));
    return item;
  }

  async updateItem(item: T) {
    await this.storageService.update(item);
    const updatedItems = this.items.map((m) => {
      if (m.id === item.id) {
        return item;
      }
      return m;
    });
    runInAction(() => (this.items = updatedItems));
    return item;
  }

  getItemIds() {
    return this.items.map((item) => item.id);
  }
}

const localService = new LocalService(Car, "car");
export const carStore = new Store(Car, localService);
