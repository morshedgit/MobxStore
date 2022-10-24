import { Category } from "../Models/Ad";
import { MainService, Store, User } from "../Models/Common";

export const categoryStore = new Store(new MainService(new Category()));
export const userStore = new Store<User>(new MainService(new User()));
