import { Category } from "./Models/Ad";
import { ERROR_CODES, Store, User } from "./Models/Common";
import {
  MockFirebaseAuthService,
  MockFirebaseService,
} from "./services/mockServices";

// test("if user is not logged", async () => {
//   const user = new User(new MockFirebaseAuthService(new User(), false));
//   expect(user.id).toBe("newUser");
//   expect(user.authenticated).toBe(false);
//   expect(user.role).toBe("anonymous");
//   const isAuth = await user.isAuthenticated();
//   expect(isAuth).toBe(false);
// });
// test("if user is logged", async () => {
//   const user = new User(new MockFirebaseAuthService(new User(), true));
//   expect(user.id).toBe("newUser");
//   expect(user.authenticated).toBe(false);
//   expect(user.role).toBe("anonymous");
//   const isAuth = await user.isAuthenticated();
//   expect(isAuth).toBe(true);
//   expect(user.role).toBe("subscriber");
// });
// test("if could log in", async () => {
//   const user = new User(new MockFirebaseAuthService(new User(), false));
//   expect(user.id).toBe("newUser");
//   expect(user.authenticated).toBe(false);
//   expect(user.role).toBe("anonymous");
//   const isReady = await user.service?.isReady();
//   expect(isReady).toBe(false);
//   const loginResult = await user.login({
//     username: "navid@email.com",
//     password: "123456",
//   });
//   expect(user.id).toBe("TestUser");
//   expect(user.username).toBe("navid@email.com");
//   expect(user.authenticated).toBe(true);
//   expect(user.role).toBe("subscriber");
// });

describe("Store Class", () => {
  test("if could fetch list when no special permission is required", async () => {
    const store = new Store(new MockFirebaseService(new Category()));
    let items = await store.getItems();
    expect(items.length).toBe(0);
    const cat = new Category();
    cat.title = "Phones";
    await store.createItem(cat);
    items = await store.getItems();
    expect(items.length).toBe(1);
    expect(items[0].title).toBe("Phones");
  });
  test("if could fetch list when user needs to be authorized", async () => {
    const store = new Store(
      new MockFirebaseService(new Category(), undefined, {
        read: false,
        create: false,
        update: false,
        delete: false,
      })
    );

    let items = await store.getItems();
    expect(() => store.getItems()).toThrow(ERROR_CODES.NOT_READY);
    const cat = new Category();
    cat.title = "Phones";
    await store.createItem(cat);
    items = await store.getItems();
    expect(items.length).toBe(1);
    expect(items[0].title).toBe("Phones");
  });
});
export {};
