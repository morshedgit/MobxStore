import { makeAutoObservable } from "mobx";
import { AuthService, IAuthService, IConsumer } from "../Services/AuthService";

export class User implements IConsumer<User> {
  id: string;
  label: "User" = "User";
  isAuthorized = false;
  constructor(
    public service: IAuthService<User>,
    itemId?: string,
    public createdAt?: string,
    public username?: string,
    public password?: string
  ) {
    makeAutoObservable(this);
    this.id = itemId ?? Math.random().toString(32);
    this.createdAt = new Date().toUTCString();
  }

  async signup(credentials: { username: string; password: string }) {
    debugger;
    this.username = credentials.username;
    this.password = credentials.password;
    const res = await this.service.create(this);
    if (!res) {
      throw Error("Could not create user");
    }
    this.username = undefined;
    this.password = undefined;
  }

  async update(username: string, password: string) {
    this.username = username;
    this.password = password;
    await this.service.update(this);
  }

  async delete() {
    try {
      await this.service.delete(this);

      console.log("Success");
    } catch {
      console.log("error");
    }
  }

  fromJson(json?: any) {
    const newUser = new User(this.service);
    if (!json) {
      return newUser;
    }
    newUser.id = json.id;
    newUser.label = json.label;
    newUser.isAuthorized = json.isAuthorized;
    newUser.username = json.username;
    newUser.password = json.password;
    newUser.createdAt = json.createdAt;
    return newUser;
  }

  toJson() {
    return {
      id: this.id,
      label: this.label,
      isAuthorized: this.isAuthorized,
      username: this.username,
      password: this.password,
      createdAt: this.createdAt,
    };
  }

  async login(credentials: { username: string; password: string }) {
    debugger;
    const res = await this.service.login(this, credentials);
    if (!res) {
      throw Error("User Not Found");
    }
    this.username = credentials.username;
    this.isAuthorized = true;
  }

  async logout() {
    const res = await this.service.logout(this);
    if (!res) throw Error("User Not Found");
    this.username = undefined;
    this.isAuthorized = false;
  }
}

export const currentUser = new User(new AuthService());
