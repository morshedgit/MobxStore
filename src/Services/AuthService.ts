export interface IConsumer<T> {
  id: string;
  username?: string;
  password?: string;
  label: string;
  toJson: (u: T) => any;
  fromJson: () => T;
}
export interface IAuthService<T> {
  login: (
    u: T,
    user: { username: string; password: string }
  ) => Promise<boolean>;
  logout: (u: T) => Promise<boolean>;
  create: (u: T) => Promise<boolean>;
  update: (u: T) => Promise<boolean>;
  delete: (u: T) => Promise<boolean>;
}

export class AuthService<T extends IConsumer<T>> implements IAuthService<T> {
  constructor() {}
  async login(user: T, credentials: { username: string; password: string }) {
    let users: any[] = JSON.parse(localStorage.getItem(user.label) ?? "[]");
    const foundUserIndex = users.findIndex(
      (u) =>
        u.username === credentials.username &&
        u.password === credentials.password
    );
    if (!foundUserIndex) return false;

    await localStorage.setItem(user.label, JSON.stringify(users));
    return true;
  }
  async logout() {
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
}
