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
  creatorId: string;
  creator?: IUser<any>;
  service?: IService<T>;
  store?: IStore<T>;
  fromJson: (json: any) => Promise<T>;
  toJson: (consumer: T) => any;
}

type UserRole = "admin" | "subscriber" | "anonymous";

export interface IUser<T extends IConsumer<T>> extends IConsumer<T> {
  username: string;
  role: UserRole;
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
  init(): Promise<boolean>;
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
  init(): Promise<boolean>;
  getItems(): Promise<T[]>;
  createItem(item: T): Promise<T>;
  deleteItem(item: T): Promise<T>;
  updateItem(item: T): Promise<T>;
  getItem(id: string): Promise<T>;
}

export enum ERROR_CODES {
  UNAUTHORIZED = "UNAUTHORIZED",
  SERVICE_ERROR = "SERVICE_ERROR",
  SERVICE_NOT_AVAILABLE = "SERVICE_NOT_AVAILABLE",
  NOT_FOUND = "NOT_FOUND",
  PARAM_NOT_FOUND = "PARAM_NOT_FOUND",
  NOT_IMPLEMENTED = "NOT_IMPLEMENTED",
  NOT_READY = "NOT_READY",
}

export enum LOADING_STATE {
  ERROR = "ERROR",
  LOADING = "LOADING",
  READY = "READY",
}

export class Store<T extends IConsumer<T>> implements IStore<T> {
  items: T[] = [];
  _isReady: LOADING_STATE = LOADING_STATE.LOADING;
  constructor(private service: IService<T>) {
    makeObservable(this, {
      items: observable.struct,
    });
    this.init()
      .then(() => {
        console.log(`Store ${this.items[0].label} is ready`);
      })
      .catch(() => {
        console.log(`Store is not ready`);
      });
  }
  async init(): Promise<boolean> {
    return new Promise(async (res, rej) => {
      try {
        if (this._isReady === LOADING_STATE.READY) res(true);
        const items = await this.service.readAll();

        this.items = items.map((item) => {
          item.store = this;
          return item;
        });
        this._isReady = LOADING_STATE.READY;
        res(true);
      } catch (e) {
        this._isReady = LOADING_STATE.ERROR;
        rej(e);
      }
    });
  }
  async getItems(t?: number): Promise<T[]> {
    await this.init();
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
    await Common.wait(() => this._isReady);
    const foundItem = this.items.find((cur) => cur.id === id);
    if (!foundItem) throw Error(ERROR_CODES.NOT_FOUND);
    return foundItem;
  }
}

export class User implements IUser<User> {
  service?: IAuthService<User>;
  creator?: IUser<any> | undefined;
  store?: IStore<User> | undefined;
  id: string = "newUser";
  label: string = "User";
  createdAt: string = "";
  updatedAt: string = "";
  creatorId = "";
  username: string = "";
  role: UserRole = "anonymous";
  authenticated = false;
  constructor(authService?: IAuthService<User>) {
    this.service = authService;
    this.creatorId = this.id;
    this.createdAt = new Date().toString();
    this.updatedAt = new Date().toString();
    makeObservable(this, {
      username: observable,
      authenticated: observable,
    });
    if (this.service) {
      this.isAuthenticated();
    }
  }
  findUserById(id: string): Promise<User> {
    const user = this.service?.read(id);
    if (!user) throw new Error(ERROR_CODES.NOT_FOUND);
    return user;
  }
  async isAuthenticated() {
    if (this.authenticated) return true;
    await this.service?.init();
    try {
      const currentUser = await this.service?.currentUser();
      if (!currentUser) return false;
      this.authenticated = true;
      this.username = currentUser?.username;
      this.role = currentUser.role;
      this.id = currentUser.id;
      return true;
    } catch {
      return false;
    }
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
    this.role = user.role;
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
    user.role = json.role;
    user.id = json.id;
    user.creator = json.creator;
    user.authenticated = json.authenticated;
    return user;
  }
  toJson(consumer: User): any {
    return {
      id: consumer.id,
      creator: consumer.creator,
      label: consumer.label,
      username: consumer.username,
      authenticated: consumer.authenticated,
    };
  }
}

export class Consumer implements IConsumer<Consumer> {
  id: string = "newConsumer";
  label: string = "Consumer";
  createdAt: string;
  creatorId: string;
  creator?: IUser<any> = undefined;
  updatedAt: string = "";
  service?: IService<Consumer>;
  constructor(service?: IService<Consumer>) {
    this.service = service;
    this.creatorId = this.id;
    this.createdAt = new Date().toString();
    this.updatedAt = new Date().toString();
    makeObservable(this, {
      updatedAt: observable,
      creator: observable,
    });
  }
  async fromJson(json: any): Promise<Consumer> {
    const consumer = new Consumer(this.service);
    consumer.id = json.id;
    consumer.creatorId = json.creator;
    return consumer;
  }
  toJson(consumer: Consumer): any {
    return {
      id: consumer.id,
      label: consumer.label,
      creator: consumer.creatorId,
    };
  }
}
