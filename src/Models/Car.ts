import { makeAutoObservable, runInAction } from "mobx";
import { IItem } from "../Services/IItem";
import { Store } from "./Store";


export class Car implements IItem<Car>{
  id: string;
  label:string = 'Car'
  static readonly label: string = "Car";
  liked = false;
  store: Store<Car>;
  constructor(
    store: Store<Car>,
    itemId?: string,
    public createdAt?: string,
    public brand?: string,
    public model?: string
  ) {
    makeAutoObservable(this);
    this.store = store;
    this.id = itemId ?? Math.random().toString(32);
  }

  factory() {
    return new Car(this.store);
  }

  async update(brand: string, model: string) {
    this.brand = brand;
    this.model = model;
    // await this.store.updateItem(this);
    runInAction(() => {
      this.brand = brand;
      this.model = model;
    });
  }

  async like(v: boolean) {
    try {
      console.log(v);
      this.liked = v;
      // await this.store.updateItem(this);
      console.log("Success");
    } catch {
      console.log("error");
      runInAction(() => (this.liked = !v));
    }
  }

  async delete() {
    try {
      await this.store.deleteItem(this);

      console.log("Success");
    } catch {
      console.log("error");
    }
  }

  fromJson(json?: Car) {
    const newCar = new Car(this.store);
    if (!json) {
      return newCar;
    }
    newCar.id = json.id;
    newCar.label = json.label;
    newCar.liked = json.liked;
    newCar.brand = json.brand;
    newCar.model = json.model;
    newCar.createdAt = json.createdAt;
    return newCar;
  }

  toJson() {
    return {
      id: this.id,
      label: this.label,
      liked: this.liked,
      brand: this.brand,
      model: this.model,
      createdAt: this.createdAt
    };
  }
};
