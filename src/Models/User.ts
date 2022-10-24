import { MainService, User } from "./Common";

export const currentUser = new User(new MainService(new User()));
