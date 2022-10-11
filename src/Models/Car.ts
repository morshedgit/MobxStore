import { makeAutoObservable } from "mobx";
import { IItem } from "../Services/IItem";
import { Store } from "../Stores/Store";
import { User } from "./User";

export class Car implements IItem<Car> {
  id: string;
  label: "Car" = "Car";
  liked = false;
  store: Store<Car>;
  constructor(
    store: Store<Car>,
    public author: User,
    itemId?: string,
    public createdAt?: string,
    public brand?: string,
    public model?: string
  ) {
    makeAutoObservable(this);
    this.store = store;
    this.id = itemId ?? Math.random().toString(32).slice(2);
    this.createdAt = new Date().toUTCString();
  }

  async update(brand: string, model: string) {
    this.brand = brand;
    this.model = model;
    await this.store.updateItem(this);
  }

  async like(v: boolean) {
    this.liked = v;
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

  async fromJson(json?: any) {
    const newCar = new Car(this.store, this.author);
    if (!json) {
      return newCar;
    }
    newCar.id = json.id;
    newCar.label = json.label;
    newCar.liked = json.liked;
    newCar.brand = json.brand;
    newCar.model = json.model;
    newCar.createdAt = json.createdAt;
    newCar.author = (await this.author.find(json.authorId)) ?? this.author;
    return newCar;
  }

  toJson() {
    return {
      id: this.id,
      label: this.label,
      liked: this.liked,
      brand: this.brand,
      model: this.model,
      createdAt: this.createdAt,
      authorId: this.author?.id,
    };
  }
}
