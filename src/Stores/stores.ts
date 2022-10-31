import { Category } from "../Models/Ad";
import { Store, User } from "../Models/Common";
import { currentUser } from "../Models/User";
import { FirebaseService } from "../services/firebase";
const categoryFactory = new Category(undefined, undefined, currentUser);
const categoryService = new FirebaseService(categoryFactory);
export const categoryStore = new Store<Category>(categoryService);
export const userStore = new Store<User>(new FirebaseService(new User()));
