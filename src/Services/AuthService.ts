export interface IConsumer<T> {
  id: string;
  username?: string;
  password?: string;
  label: string;
  toJson: (u: T) => any;
  fromJson: (json?: any) => T;
}
export interface IAuthService<T> {
  login: (
    u: T,
    user: { username: string; password: string }
  ) => Promise<string>;
  logout: (u: T) => Promise<boolean>;
  create: (u: T) => Promise<boolean>;
  update: (u: T) => Promise<boolean>;
  delete: (u: T) => Promise<boolean>;
  isAuthenticated: (u: T) => Promise<T>;
  findById: (id: string) => Promise<T | void>;
}

export class AuthService<T extends IConsumer<T>> implements IAuthService<T> {
  constructor() {}

  async isAuthenticated(user: T) {
    let users: any[] = JSON.parse(localStorage.getItem(user.label) ?? "[]");
    const foundUser = users.find((u) => u.hasSession);
    if (!foundUser) throw Error("Not Authenticated");

    return user.fromJson(foundUser);
  }
  async login(user: T, credentials: { username: string; password: string }) {
    let users: any[] = JSON.parse(localStorage.getItem(user.label) ?? "[]");
    const foundUser = users.find(
      (u) =>
        u.username === credentials.username &&
        u.password === credentials.password
    );
    if (!foundUser) return false;

    foundUser.hasSession = true;

    await localStorage.setItem(user.label, JSON.stringify(users));
    return foundUser.id;
  }
  async logout(user: T) {
    let users: any[] = JSON.parse(localStorage.getItem(user.label) ?? "[]");
    const foundUser = users.find((u) => u.id === user.id);
    if (!foundUser) throw Error("Error logging out: User not found!");

    foundUser.hasSession = false;

    await localStorage.setItem(user.label, JSON.stringify(users));
    return true;
  }
  async create(user: T) {
    let users: any[] = JSON.parse(localStorage.getItem(user.label) ?? "[]");
    users.push(user.toJson(user));
    await localStorage.setItem(user.label, JSON.stringify(users));
    return true;
  }
  async update(user: T) {
    let users: any[] = JSON.parse(localStorage.getItem(user.label) ?? "[]");
    const foundUserIndex = users.findIndex((u) => u.id === user.id);
    if (!foundUserIndex) return false;
    users = users.map((u) => {
      if (u.id === user.id) {
        return user.toJson(user);
      }
      return u;
    });
    await localStorage.setItem(user.label, JSON.stringify(users));
    return true;
  }
  async delete(user: T) {
    let users: any[] = JSON.parse(localStorage.getItem(user.label) ?? "[]");
    const foundUserIndex = users.findIndex((u) => u.id === user.id);
    if (!foundUserIndex) return false;
    users = users.filter((u) => u.id !== user.id);
    await localStorage.setItem(user.label, JSON.stringify(users));
    return true;
  }
  async findById(id: string) {
    throw Error("Not Found");
    // let users: any[] = JSON.parse(localStorage.getItem(user.label) ?? "[]");
    // const foundUserIndex = users.findIndex((u) => u.id === user.id);
    // if (!foundUserIndex) return false;
    // users = users.filter((u) => u.id !== user.id);
    // await localStorage.setItem(user.label, JSON.stringify(users));
    // return true;
  }
}

export class TestAuthService<T extends IConsumer<T>>
  implements IAuthService<T>
{
  async findById(id: string) {
    throw Error("Not Found");
  }
  async isAuthenticated(user: T) {
    const foundUser = {
      id: "samtest",
      username: "samtest",
    };
    if (!foundUser) throw Error("Not Authenticated");

    return user.fromJson(foundUser);
  }
  async login(user: T, credentials: { username: string; password: string }) {
    return "samtest";
  }
  async logout(user: T) {
    return true;
  }
  async create(user: T) {
    return true;
  }
  async update(user: T) {
    return true;
  }
  async delete(user: T) {
    return true;
  }
}
