import { makeObservable, observable, runInAction } from "mobx";
import { Car } from "../Models/Car";
import { IService } from "../Services/IService";
import { LocalService } from "../Services/LocalService";
import { IItem } from "../Services/IItem";
import { School } from "../Models/School";

export type TypeConstructor<T> = new (...args: any[]) => T;

export class Store<T extends IItem<T> & { store?: Store<T> }> {
  items: T[] = [];
  constructor(
    private factory: TypeConstructor<T>,
    private storageService: IService<T>
  ) {
    makeObservable(this, {
      items: observable.struct,
    });
    this.init();
  }

  async init() {
    try {
      let initialItems = await this.storageService.getAll();
      initialItems = initialItems.map((initItem) => {
        initItem.store = this;
        return initItem;
      });

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
    const newItem = new this.factory();
    await this.storageService.create(newItem);
    runInAction(() => (this.items = [...this.items, newItem]));
    return newItem;
  }

  async deleteItem(item: T) {
    await this.storageService.delete(item.id);
    const updatedItems = this.items.filter((m) => item.id !== m.id);
    runInAction(() => (this.items = updatedItems));
    return item;
  }

  async updateItem(item: T) {
    await this.storageService.update(item);
    return item;
  }

  getItemIds() {
    return this.items.map((item) => item.id);
  }
}
const localCarService = new LocalService(Car);
export const carStore = new Store<Car>(Car, localCarService);
const localSchoolService = new LocalService(School);
export const schoolStore = new Store<School>(School, localSchoolService);
