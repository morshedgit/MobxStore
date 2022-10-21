import { makeAutoObservable, makeObservable, observable } from "mobx";

export class UUID {
  static generateID() {
    return Math.random().toString(32).slice(2);
  }
}

export interface IConsumer<T extends IConsumer<T>> {
  id: string;
  label: string;
  createdAt: string;
  updatedAt: string;
  fromJson: (json: any) => Promise<T>;
  toJson: (consumer: T) => any;
}

export interface IUser<T extends IConsumer<T>> extends IConsumer<T> {
  username: string;
  service?: IService<T>;
  login(credentials: { username: string; password: string }): Promise<T>;
  findUserById(id: string): Promise<T>;
  logout(): Promise<boolean>;
  signup(credentials: { username: string; password: string }): Promise<boolean>;
}

export interface IService<T extends IConsumer<T>> {
  create(item: T): Promise<boolean>;
  read(id: string): Promise<T>;
  readAll(ids?: string[]): Promise<T[]>;
  update(item: T): Promise<boolean>;
  delete(item: T): Promise<boolean>;
}

export interface IStore<T extends IConsumer<T>> {
  getItems(): Promise<T[]>;
  createItem(item: T): Promise<boolean>;
  deleteItem(item: T): Promise<boolean>;
  updateItem(item: T): Promise<boolean>;
  getItem(id: string): Promise<T>;
}

export class MainService<T extends IConsumer<T>> implements IService<T> {
  items: any[] = [];

  constructor(private item: T) {
    this.items = JSON.parse(localStorage.getItem(item.label) ?? "[]");
  }
  async create(item: T): Promise<boolean> {
    const newItem = item.toJson(item);
    this.items.push(newItem);
    await localStorage.setItem(item.label, JSON.stringify(this.items));
    return true;
  }
  async read(id: string): Promise<T> {
    const item = this.items.find((cur) => cur.id === id);
    if (!item) throw Error("NOT_FOUND");
    return this.item.fromJson(item);
  }
  async readAll(ids?: string[] | undefined): Promise<T[]> {
    const items = await Promise.all(
      this.items.map((cur) => this.item.fromJson(cur))
    );
    return items;
  }
  async update(item: T): Promise<boolean> {
    const foundItem = this.items.find((cur) => cur.id === item.id);
    if (!foundItem) throw Error("NOT_FOUND");
    this.items = this.items.map((cur) => {
      if (item.id === cur.id) {
        return item.toJson(item);
      }
      return cur;
    });
    await localStorage.setItem(item.label, JSON.stringify(this.items));
    return true;
  }
  async delete(item: T): Promise<boolean> {
    const foundItem = this.items.find((cur) => cur.id === item.id);
    if (!foundItem) throw Error("NOT_FOUND");
    this.items = this.items.filter((cur) => cur.id !== item.id);
    await localStorage.setItem(item.label, JSON.stringify(this.items));
    return true;
  }
}

export enum ERROR_CODES {
  SERVICE_ERROR = "SERVICE_ERROR",
  SERVICE_NOT_AVAILABLE = "SERVICE_NOT_AVAILABLE",
  NOT_FOUND = "NOT_FOUND",
  Param_Not_Found = "Param_Not_Found",
}

export class Store<T extends IConsumer<T>> implements IStore<T> {
  items: T[] = [];
  constructor(private service: IService<T>) {
    makeObservable(this, {
      items: observable,
    });
    this.getItems().then((items) => (this.items = items));
  }
  getItems(): Promise<T[]> {
    return this.service.readAll();
  }
  createItem(item: T): Promise<boolean> {
    const result = this.service.create(item);
    if (!result) throw Error("SERVICE_ERROR");
    this.items.push(item);
    return result;
  }
  deleteItem(item: T): Promise<boolean> {
    const result = this.service.delete(item);
    if (!result) throw Error("SERVICE_ERROR");
    this.items.filter((cur) => cur.id !== item.id);
    return result;
  }
  updateItem(item: T): Promise<boolean> {
    const result = this.service.update(item);
    if (!result) throw Error("SERVICE_ERROR");
    this.items.map((cur) => {
      if (cur.id === item.id) {
        return item;
      }
      return cur;
    });
    return result;
  }
  async getItem(id: string): Promise<T> {
    const foundItem = this.items.find((cur) => cur.id === id);
    if (!foundItem) throw Error("NOT_FOUND");
    return foundItem;
  }
}

export class User implements IUser<User> {
  id: string = "";
  label: string = "User";
  username: string = "";
  createdAt: string = "";
  updatedAt: string = "";
  service?: IService<User>;
  constructor(authService?: IService<User>) {
    this.service = authService;
    this.id = UUID.generateID();
    this.createdAt = new Date().toString();
    this.updatedAt = new Date().toString();
  }
  async findUserById(id: string): Promise<User> {
    if (!this.service) throw Error("NOT_IMPLEMENTED");
    return this.service.read(id);
  }
  async login(credentials: {
    username: string;
    password: string;
  }): Promise<User> {
    if (!this.service) throw Error("NOT_IMPLEMENTED");
    // return this.authService.read(id,'User')
    return new User(this.service);
  }

  async logout(): Promise<boolean> {
    if (!this.service) throw Error("NOT_IMPLEMENTED");
    // return this.authService.read(id,'User')
    return true;
  }
  async signup(credentials: {
    username: string;
    password: string;
  }): Promise<boolean> {
    if (!this.service) throw Error("NOT_IMPLEMENTED");
    // return this.authService.read(id,'User')
    return true;
  }
  async fromJson(json: any): Promise<User> {
    const author = new User(this.service);
    // author.username = json.username
    // author.id = json.id
    return author;
  }
  toJson(consumer: User): any {
    return {
      id: consumer.id,
      label: consumer.label,
      username: consumer.username,
    };
  }
}

export class Consumer implements IConsumer<Consumer> {
  id: string = "";
  label: string = "Consumer";
  createdAt: string = "";
  updatedAt: string = "";
  service?: IService<Consumer>;
  constructor(service?: IService<Consumer>) {
    this.service = service;
    this.id = UUID.generateID();
    this.createdAt = new Date().toString();
    this.updatedAt = new Date().toString();
    makeObservable(this, {
      updatedAt: observable,
    });
  }
  async fromJson(json: any): Promise<Consumer> {
    const consumer = new Consumer(this.service);
    consumer.id = json.id;
    return consumer;
  }
  toJson(consumer: Consumer): any {
    return {
      id: consumer.id,
      label: consumer.label,
    };
  }
}
