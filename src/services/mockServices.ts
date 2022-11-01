import {
  Common,
  ERROR_CODES,
  IAuthService,
  IConsumer,
  IService,
  IUser,
  LOADING_STATE,
  User,
} from "../Models/Common";

const registeredUsers = [
  {
    uid: "user1",
    email: "navid@email.com",
    password: "123456",
  },
  {
    uid: "user2",
    email: "omid@email.com",
    password: "123456",
  },
];
const userProfiles = [
  {
    uid: "user1",
    email: "navid@email.com",
    role: "subscriber",
  },
];
export class MockFirebaseAuthService<T extends IUser<T>>
  implements IAuthService<T>
{
  _isReady: LOADING_STATE = LOADING_STATE.LOADING;
  constructor(private factory: T, private isServiceAvailable: boolean) {}
  init(): Promise<boolean> {
    return new Promise(async (res, rej) => {
      try {
        if (this._isReady === LOADING_STATE.READY) res(true);
        setTimeout(() => {
          if (this.isServiceAvailable) {
            this._isReady = LOADING_STATE.READY;
            res(true);
          } else {
            rej(ERROR_CODES.NOT_FOUND);
          }
        }, 1000);
      } catch (e) {
        this._isReady = LOADING_STATE.ERROR;
        rej(e);
      }
    });
  }
  async signup(credentials: {
    username: string;
    password: string;
  }): Promise<IUser<T>> {
    await this.init();
    const user = {
      email: credentials.username,
      uid: "TestUser",
    };
    const newUser = this.factory.fromJson({
      username: user.email,
      id: user.uid,
    });
    return newUser;
  }
  async login({
    username: email,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<IUser<T>> {
    await this.init();
    const user = registeredUsers.find(
      (u) => u.email === email && u.password === password
    );
    // console.log(user);
    if (!user) throw ERROR_CODES.NOT_FOUND;
    const loggedUser = await this.factory.fromJson({
      id: user.uid,
      username: user.email,
    });
    const userProfile = await this.read(loggedUser.id)
      .then((u) => u)
      .catch(() => undefined);

    loggedUser.role = userProfile ? userProfile.role : "anonymous";
    return loggedUser;
  }
  async logout(): Promise<boolean> {
    await this.init();
    return true;
  }
  async currentUser(): Promise<IUser<T>> {
    await this.init();
    const newUser = this.factory.fromJson({
      username: "test@email.com",
      id: "currentUser",
      role: "subscriber",
    });
    return newUser;
  }
  async updateUser(item: IUser<T>): Promise<IUser<T>> {
    await this.init();
    throw new Error("Method not implemented.");
  }
  async deleteUser(item: IUser<T>): Promise<IUser<T>> {
    await this.init();
    throw new Error("Method not implemented.");
  }
  async create(item: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  async read(id: string): Promise<T> {
    await this.init();
    const userProfile = userProfiles.find((u) => u.uid === id);
    if (!userProfile) throw ERROR_CODES.NOT_FOUND;
    const newUser = this.factory.fromJson({
      username: userProfile.email,
      id: userProfile.uid,
      role: userProfile.role,
    });
    return newUser;
  }
  readAll(ids?: string[] | undefined): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
  update(item: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  delete(item: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  async find(query: { key: string; value: any }[]): Promise<T | undefined> {
    throw new Error("Method not implemented.");
  }
}

export class MockFirebaseService<T extends IConsumer<T>>
  implements IService<T>
{
  items: any[] = [];
  _isReady: LOADING_STATE = LOADING_STATE.LOADING;
  constructor(
    private factory: T,
    public authUser?: IUser<User>,
    private permissions: {
      read: boolean;
      create: boolean;
      update: boolean;
      delete: boolean;
    } = {
      read: true,
      create: true,
      update: true,
      delete: true,
    }
  ) {}
  async init() {
    return new Promise((res, rej) => {
      try {
        if (this._isReady === LOADING_STATE.READY) res(true);
        setTimeout(() => {
          this._isReady = LOADING_STATE.READY;
          res(true);
        }, 1000);
      } catch (e) {
        this._isReady === LOADING_STATE.ERROR;
        rej(e);
      }
    });
  }
  async create(item: T): Promise<T> {
    await this.init();
    if (!this.permissions.create) throw new Error(ERROR_CODES.UNAUTHORIZED);
    item.id = Common.generateID();
    const jsonData = item.toJson(item);
    this.items.push(jsonData);
    return item;
  }
  async read(id: string): Promise<T> {
    await this.init();
    if (!this.permissions.read) throw new Error(ERROR_CODES.UNAUTHORIZED);
    throw new Error("Method not implemented.");
  }
  async readAll(ids?: string[] | undefined): Promise<T[]> {
    await this.init();
    if (!this.permissions.read) throw new Error(ERROR_CODES.UNAUTHORIZED);
    const uid = this.authUser?.id;

    const items: T[] = [];
    this.items
      // .filter((item) => item.author === uid)
      .forEach(async (doc) => {
        const item = await this.factory.fromJson(doc);
        item.id = doc.id;
        items.push(item);
      });

    return items;
  }
  async update(item: T): Promise<T> {
    await this.init();
    if (!this.permissions.update) throw new Error(ERROR_CODES.UNAUTHORIZED);
    throw new Error("Method not implemented.");
  }
  async delete(item: T): Promise<T> {
    await this.init();
    if (!this.permissions.delete) throw new Error(ERROR_CODES.UNAUTHORIZED);
    throw new Error("Method not implemented.");
  }
  async find(query: { key: string; value: any }[]): Promise<T | undefined> {
    await this.init();
    if (!this.permissions.read) throw new Error(ERROR_CODES.UNAUTHORIZED);
    throw new Error("Method not implemented.");
  }
}

export class NotImplementedMockService<T extends IConsumer<T>>
  implements IService<T>
{
  create(item: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  read(id: string): Promise<T> {
    throw new Error("Method not implemented.");
  }
  readAll(ids?: string[] | undefined): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
  update(item: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  delete(item: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  find(query: { key: string; value: any }[]): Promise<T | undefined> {
    throw new Error("Method not implemented.");
  }
}
export class NotConnectingMockService<T extends IConsumer<T>>
  implements IService<T>
{
  _isReady: LOADING_STATE = LOADING_STATE.LOADING;

  async init() {
    return new Promise((res, rej) => {
      if (this._isReady === LOADING_STATE.READY) res(true);
      setTimeout(() => {
        this._isReady = LOADING_STATE.ERROR;
        rej(Error(ERROR_CODES.SERVICE_ERROR));
      }, 1000);
    });
  }
  async create(item: T): Promise<T> {
    await this.init();
    throw new Error("Method not implemented.");
  }
  async read(id: string): Promise<T> {
    await this.init();
    throw new Error("Method not implemented.");
  }
  async readAll(ids?: string[] | undefined): Promise<T[]> {
    await this.init();
    throw new Error("Method not implemented.");
  }
  async update(item: T): Promise<T> {
    await this.init();
    throw new Error("Method not implemented.");
  }
  async delete(item: T): Promise<T> {
    await this.init();
    throw new Error("Method not implemented.");
  }
  async find(query: { key: string; value: any }[]): Promise<T | undefined> {
    await this.init();
    throw new Error("Method not implemented.");
  }
}
