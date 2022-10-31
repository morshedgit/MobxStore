// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, query, setDoc, where } from "firebase/firestore";
import {
  collection,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  Common,
  ERROR_CODES,
  IAuthService,
  IConsumer,
  IService,
  IUser,
  User,
} from "../Models/Common";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEPbjTneKWQcvtw7MAnlqyoE-UZjWhUhA",
  authDomain: "mystartup-4d959.firebaseapp.com",
  projectId: "mystartup-4d959",
  storageBucket: "mystartup-4d959.appspot.com",
  messagingSenderId: "552659198933",
  appId: "1:552659198933:web:9abfca0d535518e20d135c",
  measurementId: "G-BLNJFM3BCE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
const auth = getAuth(app);

export class FirebaseAuthService<T extends IUser<T>>
  implements IAuthService<T>
{
  _isReady = false;
  constructor(private factory: T) {}
  isReady(): Promise<boolean> {
    return new Promise(async (res) => {
      try {
        if (this._isReady) res(true);
        const u = await this.init();
        if (u) this._isReady = true;
        res(true);
      } catch {
        res(false);
      }
    });
  }
  async init() {
    return new Promise((res) => {
      auth.onAuthStateChanged((user) => {
        res(user);
      });
    });
  }
  async signup(credentials: {
    username: string;
    password: string;
  }): Promise<IUser<T>> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.username,
      credentials.password
    );
    const user = userCredential.user;
    const newUser = this.factory.fromJson({
      username: user.email,
      id: user.uid,
    });
    return newUser;
  }
  async login({
    username: email,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<IUser<T>> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const loggedUser = this.factory.fromJson({
      id: user.uid,
      username: user.email,
    });
    return loggedUser;
  }
  async logout(): Promise<boolean> {
    await signOut(auth);
    return true;
  }
  async currentUser(): Promise<IUser<T>> {
    await this.init();
    const user = auth.currentUser;
    if (!user) throw Error(ERROR_CODES.NOT_FOUND);
    const userProfile = await this.read(user.uid);
    const newUser = this.factory.fromJson({
      username: user?.email,
      id: user?.uid,
      role: userProfile.role,
    });
    return newUser;
  }
  updateUser(item: IUser<T>): Promise<IUser<T>> {
    throw new Error("Method not implemented.");
  }
  deleteUser(item: IUser<T>): Promise<IUser<T>> {
    throw new Error("Method not implemented.");
  }
  async create(item: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  async read(id: string): Promise<T> {
    const userRef = doc(db, `users/${id}`);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error(ERROR_CODES.NOT_FOUND);
    const user = userSnap.data();
    const newUser = this.factory.fromJson({
      username: user?.email,
      id: user?.uid,
      role: user?.role,
    });
    return newUser;

    throw new Error("Method not implemented.");
  }
  readAll(ids?: string[] | undefined): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
  update(item: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  delete(item: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  async find(query: { key: string; value: any }[]): Promise<T | undefined> {
    throw new Error("Method not implemented.");
  }
}

export class FirebaseService<T extends IConsumer<T>> implements IService<T> {
  constructor(private factory: T, public authUser?: IUser<User>) {}
  async create(item: T): Promise<T> {
    const docRef = doc(collection(db, this.factory.label));
    item.id = docRef.id;
    const jsonData = item.toJson(item);
    await setDoc(docRef, jsonData);
    return item;
  }
  read(id: string): Promise<T> {
    throw new Error("Method not implemented.");
  }
  async readAll(ids?: string[] | undefined): Promise<T[]> {
    const uid = this.authUser?.id;
    const itemsRef = collection(db, this.factory.label);

    const q = query(itemsRef, where("author", "in", [uid]));

    const querySnapshot = await getDocs(q);

    const items: T[] = [];
    querySnapshot.forEach(async (doc) => {
      const item = await this.factory.fromJson(doc.data());
      item.id = doc.id;
      items.push(item);
    });

    return items;
  }
  async update(item: T): Promise<T> {
    const itemRef = doc(db, item.label, item.id);
    await updateDoc(itemRef, item.toJson(item));
    return item;
  }
  async delete(item: T): Promise<T> {
    const itemRef = doc(db, item.label, item.id);
    await deleteDoc(itemRef);
    return item;
  }
  find(query: { key: string; value: any }[]): Promise<T | undefined> {
    throw new Error("Method not implemented.");
  }
}
