import {
  Common,
  ERROR_CODES,
  IAuthService,
  IConsumer,
  IService,
  IUser,
  LOADING_STATE,
  User,
  UserRole,
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
  {
    uid: "admin",
    email: "admin@email.com",
    password: "123456",
  },
  {
    uid: "LpCZxJdRCAfDoB7wKNTsU13pKUV2",
    email: "sina@email.com",
    password: "123456",
  },
  {
    uid: "VK8DACLF61NQqe4eBwiLsiOzT3y1",
    email: "kian@email.com",
    password: "123456",
  },
];
const userProfiles = [
  {
    uid: "admin",
    email: "admin@email.com",
    role: "admin",
  },
  {
    uid: "LpCZxJdRCAfDoB7wKNTsU13pKUV2",
    email: "sina@email.com",
    role: "admin",
  },
  {
    uid: "VK8DACLF61NQqe4eBwiLsiOzT3y1",
    email: "kian@email.com",
    role: "subscriber",
  },
];
const categories = [
  {
    creator: "VK8DACLF61NQqe4eBwiLsiOzT3y1",
    title: "Animals",
    description: "animals",
    createdAt: "Tue Nov 01 2022 18:54:24 GMT-0700 (Pacific Daylight Time)",
    id: "7M9VuxDmVPlu1mtkUAkz",
    updatedAt: "Tue Nov 01 2022 18:54:24 GMT-0700 (Pacific Daylight Time)",
  },
  {
    title: "Books",
    id: "F4bKRg1jHYdmes0L5ZqM",
    createdAt: "Tue Nov 01 2022 18:55:23 GMT-0700 (Pacific Daylight Time)",
    creator: "VK8DACLF61NQqe4eBwiLsiOzT3y1",
    updatedAt: "Tue Nov 01 2022 18:55:23 GMT-0700 (Pacific Daylight Time)",
    description: "Old books",
  },
  {
    createdAt: "Tue Nov 01 2022 17:25:43 GMT-0700 (Pacific Daylight Time)",
    description: "by sina",
    updatedAt: "Tue Nov 01 2022 17:25:43 GMT-0700 (Pacific Daylight Time)",
    title: "Phones",
    creator: "LpCZxJdRCAfDoB7wKNTsU13pKUV2",
    id: "GvaHEJdrzcyM4kYP7uTe",
  },
  {
    updatedAt: "Tue Nov 01 2022 17:25:55 GMT-0700 (Pacific Daylight Time)",
    title: "Digitals",
    creator: "LpCZxJdRCAfDoB7wKNTsU13pKUV2",
    description: "by sina",
    id: "cdx97c1ZirlOLa6RlUCg",
    createdAt: "Tue Nov 01 2022 17:25:55 GMT-0700 (Pacific Daylight Time)",
  },
  {
    creator: "LpCZxJdRCAfDoB7wKNTsU13pKUV2",
    updatedAt: "Tue Nov 01 2022 17:26:05 GMT-0700 (Pacific Daylight Time)",
    createdAt: "Tue Nov 01 2022 17:26:05 GMT-0700 (Pacific Daylight Time)",
    id: "j4CJhjbDPvWDYQ8MOlPv",
    title: "TVs ",
    description: "by sina",
  },
  {
    description: "by kian",
    title: "Boats",
    creator: "VK8DACLF61NQqe4eBwiLsiOzT3y1",
    updatedAt: "Tue Nov 01 2022 17:27:00 GMT-0700 (Pacific Daylight Time)",
    createdAt: "Tue Nov 01 2022 17:27:00 GMT-0700 (Pacific Daylight Time)",
    id: "lhDOFWXVXCZsOzuSWcwA",
  },
  {
    creator: "VK8DACLF61NQqe4eBwiLsiOzT3y1",
    id: "zjw2M9SOECmYL1xfIqb6",
    createdAt: "Tue Nov 01 2022 17:26:44 GMT-0700 (Pacific Daylight Time)",
    description: "by kian",
    title: "Cars",
    updatedAt: "Tue Nov 01 2022 17:26:44 GMT-0700 (Pacific Daylight Time)",
  },
];
enum Roles {
  SUBSCRIBER = "subscriber",
  ANONYMOUS = "anonymous",
  ADMIN = "admin",
  EDITOR = "editor",
  CREATOR = "creator",
}

type Permissions = {
  read: boolean;
  write: boolean;
};

const RolePermissionMap: Record<UserRole, Permissions> = {
  [Roles.ADMIN]: {
    read: true,
    write: true,
  },
  [Roles.ANONYMOUS]: {
    read: true,
    write: false,
  },
  [Roles.SUBSCRIBER]: {
    read: true,
    write: false,
  },
  [Roles.EDITOR]: {
    read: true,
    write: true,
  },
  [Roles.CREATOR]: {
    read: true,
    write: true,
  },
};

type UserGroup = {
  [id: string]: {
    role: UserRole[];
  };
};
// Querying resources with user id xxxx.
// First checks the user id belongs to a policy
/**
 * GOALS:
 * - Allow a user to query resources based on permissions
 * - A resource should be accessible by public, creator, admin, team members
 * - A resource only have creator id
 */
const designTeam: UserGroup = {
  user1ID: {
    role: [Roles.SUBSCRIBER, Roles.EDITOR, Roles.CREATOR],
  },
  user2ID: {
    role: [Roles.SUBSCRIBER],
  },
};
type AccessPolicy = UserGroup[];

type ResourceType = "Category";
const resources: Record<
  ResourceType,
  {
    acl: AccessPolicy; // author, admin, group
    data: any[];
  }
> = {
  Category: {
    acl: [designTeam],
    data: categories,
  },
};

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
  readAll(protectionLevel: UserRole = "anonymous"): Promise<T[]> {
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
    public authUser?: IUser<User> // private permissions: { //   read: boolean; //   create: boolean; //   update: boolean; //   delete: boolean; // } = { //   read: true, //   create: true, //   update: true, //   delete: true, // }
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
  async readAll(): Promise<T[]> {
    await this.init();
    const resourceType = this.factory.label as ResourceType;
    const readRoles = resources[resourceType].acl.read;
    if (
      readRoles.length === 0 ||
      (this.authUser?.role && this.authUser.role in readRoles)
    ) {
      return Promise.all(
        resources[resourceType].data.map((r) => this.factory.fromJson(r))
      );
    }

    const uid = this.authUser?.id;

    if (this.authUser?.role && this.authUser.role in readRoles) {
    }

    // const items: T[] = [];
    //   // .filter((item) => item.author === uid)
    //   .forEach(async (doc) => {
    //     const item = await this.factory.fromJson(doc);
    //     item.id = doc.id;
    //     items.push(item);
    //   });

    // return items;
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

export class NotImplementedMockService<T extends IConsumer<T>>
  implements IService<T>
{
  create(item: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  read(id: string): Promise<T> {
    throw new Error("Method not implemented.");
  }
  readAll(protectionLevel: UserRole = "anonymous"): Promise<T[]> {
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
  async readAll(protectionLevel: UserRole = "anonymous"): Promise<T[]> {
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
