import {
  Common,
  ERROR_CODES,
  IAuthService,
  IConsumer,
  IService,
  IUser,
  User,
} from "../Models/Common";

export class MockFirebaseAuthService<T extends IUser<T>>
  implements IAuthService<T>
{
  _isReady = false;
  constructor(private factory: T, private isLogged: boolean) {}
  init(): Promise<boolean> {
    return new Promise(async (res) => {
      try {
        if (this._isReady) res(true);
        const u = await this.init();
        if (u) this._isReady = true;
        res(true);
      } catch {
        res(false);
      }
    });
  }
  async init(): Promise<boolean> {
    return new Promise((res, rej) => {
      setTimeout(
        () => (this.isLogged ? res(true) : rej(ERROR_CODES.NOT_FOUND)),
        1000
      );
    });
  }
  async signup(credentials: {
    username: string;
    password: string;
  }): Promise<IUser<T>> {
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
  updateUser(item: IUser<T>): Promise<IUser<T>> {
    throw new Error("Method not implemented.");
  }
  deleteUser(item: IUser<T>): Promise<IUser<T>> {
    throw new Error("Method not implemented.");
  }
  async create(item: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  async read(id: string): Promise<T> {
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
