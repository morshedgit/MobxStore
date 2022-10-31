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

export class MockFirebaseAuthService<T extends IUser<T>>
  implements IAuthService<T>
{
  _isReady: LOADING_STATE = LOADING_STATE.LOADING;
  constructor(private factory: T, private isLogged: boolean) {}
  init(): Promise<boolean> {
    return new Promise(async (res, rej) => {
      try {
        if (this._isReady === LOADING_STATE.READY) res(true);
        setTimeout(() => {
          if (this.isLogged) {
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
    const user = {
      email,
      uid: "TestUser",
    };
    const loggedUser = await this.factory.fromJson({
      id: user.uid,
      username: user.email,
    });
    const userProfile = await this.read(loggedUser.id);
    loggedUser.role = userProfile.role;
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
    const newUser = this.factory.fromJson({
      username: "test@user.com",
      id: "TestUser",
      role: "subscriber",
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
  async init() {}
  async create(item: T): Promise<T> {
    if (!this.permissions.create) throw new Error(ERROR_CODES.UNAUTHORIZED);
    item.id = Common.generateID();
    const jsonData = item.toJson(item);
    this.items.push(jsonData);
    return item;
  }
  read(id: string): Promise<T> {
    if (!this.permissions.read) throw new Error(ERROR_CODES.UNAUTHORIZED);
    throw new Error("Method not implemented.");
  }
  async readAll(ids?: string[] | undefined): Promise<T[]> {
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
    if (!this.permissions.update) throw new Error(ERROR_CODES.UNAUTHORIZED);
    throw new Error("Method not implemented.");
  }
  async delete(item: T): Promise<T> {
    if (!this.permissions.delete) throw new Error(ERROR_CODES.UNAUTHORIZED);
    throw new Error("Method not implemented.");
  }
  find(query: { key: string; value: any }[]): Promise<T | undefined> {
    if (!this.permissions.read) throw new Error(ERROR_CODES.UNAUTHORIZED);
    throw new Error("Method not implemented.");
  }
}
