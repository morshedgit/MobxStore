import { Category } from "../Models/Ad";
import { Store, User } from "../Models/Common";
import { currentUser } from "../Models/User";
import { FirebaseService } from "../services/firebase";

export const categoryStore = new Store<Category>(
  new FirebaseService(new Category(undefined, undefined, currentUser))
);
export const userStore = new Store<User>(new FirebaseService(new User()));
