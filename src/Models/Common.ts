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
  authorId: string;
  author?: IUser<any>;
  service?: IService<T>;
  store?: IStore<T>;
  fromJson: (json: any) => Promise<T>;
  toJson: (consumer: T) => any;
}

export interface IUser<T extends IConsumer<T>> extends IConsumer<T> {
  username: string;
  authenticated: boolean;
  service?: IAuthService<T>;
  login(credentials: { username: string; password: string }): Promise<T>;
  logout(): Promise<boolean>;
  signup(credentials: { username: string; password: string }): Promise<T>;
  findUserById(id: string): Promise<T>;
}

export interface IService<T extends IConsumer<T>> {
  create(item: T): Promise<T>;
  read(id: string): Promise<T>;
  readAll(ids?: string[]): Promise<T[]>;
  update(item: T): Promise<T>;
  delete(item: T): Promise<T>;
  find(query: { key: string; value: any }[]): Promise<T | undefined>;
}
export interface IAuthService<T extends IConsumer<T>> extends IService<T> {
  signup(credentials: {
    username: string;
    password: string;
  }): Promise<IUser<T>>;
  login(credentials: { username: string; password: string }): Promise<IUser<T>>;
  logout(): Promise<boolean>;
  currentUser(): Promise<IUser<T>>;
  updateUser(item: IUser<T>): Promise<IUser<T>>;
  deleteUser(item: IUser<T>): Promise<IUser<T>>;
}

export interface IStore<T extends IConsumer<T>> {
  getItems(): Promise<T[]>;
  createItem(item: T): Promise<T>;
  deleteItem(item: T): Promise<T>;
  updateItem(item: T): Promise<T>;
  getItem(id: string): Promise<T>;
}

export enum ERROR_CODES {
  SERVICE_ERROR = "SERVICE_ERROR",
  SERVICE_NOT_AVAILABLE = "SERVICE_NOT_AVAILABLE",
  NOT_FOUND = "NOT_FOUND",
  PARAM_NOT_FOUND = "PARAM_NOT_FOUND",
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
      this.items = items.map((item) => {
        item.store = this;
        return item;
      });
      this.isReady = true;
    });
  }
  async getItems(t?: number): Promise<T[]> {
    await Common.wait(() => this.isReady);
    return this.items;
  }
  async createItem(item: T): Promise<T> {
    const result = await this.service.create(item);
    if (!result) throw Error("SERVICE_ERROR");
    this.items.push(item);
    return result;
  }
  async deleteItem(item: T): Promise<T> {
    const result = await this.service.delete(item);
    if (!result) throw Error("SERVICE_ERROR");
    this.items = this.items.filter((cur) => cur.id !== item.id);
    return result;
  }
  async updateItem(item: T): Promise<T> {
    const result = await this.service.update(item);
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
  service?: IAuthService<User> | undefined;
  author?: IUser<any> | undefined;
  store?: IStore<User> | undefined;
  id: string = "";
  label: string = "User";
  createdAt: string = "";
  updatedAt: string = "";
  authorId = "";
  username: string = "";
  authenticated = false;
  constructor(authService?: IAuthService<User>) {
    this.service = authService;
    this.id = Common.generateID();
    this.authorId = this.id;
    this.createdAt = new Date().toString();
    this.updatedAt = new Date().toString();
    makeObservable(this, {
      username: observable,
      authenticated: observable,
    });
  }
  findUserById(id: string): Promise<User> {
    const user = this.service?.read(id);
    if (!user) throw new Error(ERROR_CODES.NOT_FOUND);
    return user;
  }
  async isAuthenticated() {
    if (this.authenticated) return true;
    const currentUser = await this.service?.currentUser();
    if (!currentUser) throw Error(ERROR_CODES.NOT_FOUND);
    this.authenticated = true;
    this.username = currentUser?.username;
    this.id = currentUser.id;
    return true;
  }
  async login(credentials: {
    username: string;
    password: string;
  }): Promise<User> {
    if (!this.service) throw Error(ERROR_CODES.NOT_IMPLEMENTED);
    const user = await this.service.login(credentials);
    if (!user) {
      throw Error(ERROR_CODES.NOT_FOUND);
    }
    this.authenticated = true;
    this.username = user.username;
    this.id = user.id;
    this.createdAt = user.createdAt;
    return this;
  }
  async logout(): Promise<boolean> {
    if (!this.service) throw Error(ERROR_CODES.NOT_IMPLEMENTED);
    this.authenticated = false;
    await this.service.logout();
    return true;
  }
  async signup(credentials: {
    username: string;
    password: string;
  }): Promise<User> {
    if (!this.service) throw Error(ERROR_CODES.NOT_IMPLEMENTED);
    await this.service.signup(credentials);
    const newUser = new User();
    newUser.username = credentials.username;
    return newUser;
  }
  async fromJson(json: any): Promise<User> {
    const user = new User(this.service);
    user.username = json.username;
    user.id = json.id;
    user.author = json.owner;
    user.authenticated = json.authenticated;
    return user;
  }
  toJson(consumer: User): any {
    return {
      id: consumer.id,
      owner: consumer.author,
      label: consumer.label,
      username: consumer.username,
      authenticated: consumer.authenticated,
    };
  }
}

export class Consumer implements IConsumer<Consumer> {
  id: string;
  label: string = "Consumer";
  createdAt: string;
  authorId: string;
  author?: IUser<any>;
  updatedAt: string = "";
  service?: IService<Consumer>;
  constructor(service?: IService<Consumer>) {
    this.service = service;
    this.id = Common.generateID();
    this.authorId = this.id;
    this.createdAt = new Date().toString();
    this.updatedAt = new Date().toString();
    makeObservable(this, {
      updatedAt: observable,
      author: observable,
    });
  }
  async fromJson(json: any): Promise<Consumer> {
    const consumer = new Consumer(this.service);
    consumer.id = json.id;
    consumer.authorId = json.author;
    return consumer;
  }
  toJson(consumer: Consumer): any {
    return {
      id: consumer.id,
      label: consumer.label,
      author: consumer.authorId,
    };
  }
}
