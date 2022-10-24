import { makeObservable, observable } from "mobx";

export class Common {
  static generateID() {
    return Math.random().toString(32).slice(2);
  }
  static wait(isReady: () => boolean, t?: number) {
    return new Promise(async (res, rej) => {
      const rejectTimeout = setTimeout(() => {
        if (!isReady()) {
          clearInterval(resInterval);
          rej(ERROR_CODES.SERVICE_ERROR);
        }
      }, t ?? 3000);
      const resInterval = setInterval(async () => {
        if (isReady()) {
          clearTimeout(rejectTimeout);
          clearInterval(resInterval);
          res(true);
        }
      }, 50);
    });
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
  authenticated: boolean;
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
  find(query: { key: string; value: any }[]): Promise<T | undefined>;
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
  async find(query: { key: string; value: any }[]) {
    const result = this.items.find((cur) => {
      return query
        .map(({ key, value }) => {
          if (cur[key] !== value) {
            return false;
          }
          return true;
        })
        .every((c) => c);
    });
    return result;
  }
}

export enum ERROR_CODES {
  SERVICE_ERROR = "SERVICE_ERROR",
  SERVICE_NOT_AVAILABLE = "SERVICE_NOT_AVAILABLE",
  NOT_FOUND = "NOT_FOUND",
  Param_Not_Found = "Param_Not_Found",
  NOT_IMPLEMENTED = "NOT_IMPLEMENTED",
}

export class Store<T extends IConsumer<T>> implements IStore<T> {
  items: T[] = [];
  isReady = false;
  constructor(private service: IService<T>) {
    makeObservable(this, {
      items: observable.struct,
    });
    this.service.readAll().then((items) => {
      this.items = items;
      this.isReady = true;
    });
  }
  async getItems(t?: number): Promise<T[]> {
    await Common.wait(() => this.isReady);
    return this.items;
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
    this.items = this.items.filter((cur) => cur.id !== item.id);
    return result;
  }
  updateItem(item: T): Promise<boolean> {
    const result = this.service.update(item);
    if (!result) throw Error("SERVICE_ERROR");
    return result;
  }
  async getItem(id: string): Promise<T> {
    await Common.wait(() => this.isReady);
    const foundItem = this.items.find((cur) => cur.id === id);
    if (!foundItem) throw Error(ERROR_CODES.NOT_FOUND);
    return foundItem;
  }
}

export class User implements IUser<User> {
  id: string = "";
  label: string = "User";
  username: string = "";
  password?: string = "";
  authenticated = false;
  createdAt: string = "";
  updatedAt: string = "";
  service?: IService<User>;
  constructor(authService?: IService<User>) {
    this.service = authService;
    this.id = Common.generateID();
    this.createdAt = new Date().toString();
    this.updatedAt = new Date().toString();
    makeObservable(this, {
      username: observable,
      authenticated: observable,
    });
    this.isLogged();
  }
  async isLogged() {
    const id = localStorage.getItem("loggedUserId");
    if (!id) {
      return;
    }
    const user = await this.findUserById(id);
    if (!user) {
      return;
    }
    this.authenticated = true;
    this.username = user.username;
    this.id = user.id;
    this.createdAt = user.createdAt;
  }
  async findUserById(id: string): Promise<User> {
    if (!this.service) throw Error(ERROR_CODES.NOT_IMPLEMENTED);
    return this.service.read(id);
  }
  async login(credentials: {
    username: string;
    password: string;
  }): Promise<User> {
    if (!this.service) throw Error(ERROR_CODES.NOT_IMPLEMENTED);
    const user = await this.service.find([
      {
        key: "username",
        value: credentials.username,
      },
      {
        key: "password",
        value: credentials.password,
      },
    ]);
    if (!user) {
      throw Error(ERROR_CODES.NOT_FOUND);
    }
    this.authenticated = true;
    this.username = user.username;
    this.id = user.id;
    this.createdAt = user.createdAt;
    await this.service.update(this);
    localStorage.setItem("loggedUserId", this.id);
    return this;
  }

  async logout(): Promise<boolean> {
    if (!this.service) throw Error(ERROR_CODES.NOT_IMPLEMENTED);
    this.authenticated = false;
    await this.service.update(this);
    localStorage.setItem("loggedUserId", "");
    return true;
  }
  async signup(credentials: {
    username: string;
    password: string;
  }): Promise<boolean> {
    if (!this.service) throw Error(ERROR_CODES.NOT_IMPLEMENTED);
    const newUser = new User();
    newUser.username = credentials.username;
    await this.service.create(newUser);
    return true;
  }
  async fromJson(json: any): Promise<User> {
    const user = new User(this.service);
    user.username = json.username;
    user.id = json.id;
    user.authenticated = json.authenticated;
    return user;
  }
  toJson(consumer: User): any {
    return {
      id: consumer.id,
      label: consumer.label,
      username: consumer.username,
      authenticated: consumer.authenticated,
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
    this.id = Common.generateID();
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
