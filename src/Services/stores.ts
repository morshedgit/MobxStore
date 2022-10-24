import { Category } from "../Models/Ad";
import { MainService, Store, User } from "../Models/Common";

export const categoryStore = new Store<Category>(
  new MainService(new Category(undefined, undefined, new User()))
);
export const userStore = new Store<User>(new MainService(new User()));
