import { makeObservable, observable, runInAction } from "mobx";
import {
  AuthService,
  IAuthService,
  IConsumer,
  // TestAuthService,
} from "../Services/AuthService";

export class User implements IConsumer<User> {
  id: string;
  label: "User" = "User";
  authenticated = false;
  constructor(
    public service: IAuthService<User>,
    initialLoading: boolean = false,
    itemId?: string,
    public createdAt?: string,
    public username?: string,
    public password?: string
  ) {
    makeObservable(this, {
      username: observable,
      authenticated: observable,
      id: observable,
    });
    this.id = itemId ?? Math.random().toString(32);
    this.createdAt = new Date().toUTCString();
    if (initialLoading) {
      this.service.isAuthenticated(this).then((authenticatedUser) => {
        runInAction(() => {
          this.username = authenticatedUser.username;
          this.authenticated = true;
          this.id = authenticatedUser.id;
        });
      });
    }
  }

  async signup(credentials: { username: string; password: string }) {
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
    newUser.authenticated = json.isAuthorized;
    newUser.username = json.username;
    newUser.password = json.password;
    newUser.createdAt = json.createdAt;
    return newUser;
  }

  toJson() {
    return {
      id: this.id,
      label: this.label,
      isAuthenticated: this.authenticated,
      username: this.username,
      password: this.password,
      createdAt: this.createdAt,
    };
  }

  async login(credentials: { username: string; password: string }) {
    const userId = await this.service.login(this, credentials);
    if (!userId) {
      throw Error("User Not Found");
    }
    runInAction(() => {
      this.id = userId;
      this.username = credentials.username;
      this.authenticated = true;
    });
  }

  async logout() {
    const res = await this.service.logout(this);
    if (!res) throw Error("User Not Found");
    runInAction(() => {
      this.username = undefined;
      this.authenticated = false;
    });
  }

  async find(userId: string) {
    return this.service.findById(userId);
  }
}

export const currentUser = new User(new AuthService(), true);
