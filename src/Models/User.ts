import { FirebaseAuthService, FirebaseService } from "../services/firebase";
import { User } from "./Common";

export const currentUser = new User(new FirebaseAuthService(new User()));
