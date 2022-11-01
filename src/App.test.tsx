import { Category } from "./Models/Ad";
import { ERROR_CODES, Store, User } from "./Models/Common";
import {
  MockFirebaseAuthService,
  MockFirebaseService,
  NotConnectingMockService,
  NotImplementedMockService,
} from "./services/mockServices";

describe("AuthService Class", () => {
  describe("login", () => {
    test("if login works", async () => {
      const authService = new MockFirebaseAuthService(new User(), true);
      const user = await authService.login({
        username: "navid@email.com",
        password: "123456",
      });
      expect(user.username).toBe("navid@email.com");
      expect(user.role).toBe("subscriber");
    });
    test("if login fails when user is not registered", async () => {
      const authService = new MockFirebaseAuthService(new User(), true);
      await authService
        .login({
          username: "notRegisteredUser@email.com",
          password: "123456",
        })
        .catch((e) => expect(e).toBe(ERROR_CODES.NOT_FOUND));
    });
    test("if login succeeds when user is registered but profile not found", async () => {
      const authService = new MockFirebaseAuthService(new User(), true);
      const user = await authService.login({
        username: "omid@email.com",
        password: "123456",
      });
      expect(user.username).toBe("omid@email.com");
      expect(user.role).toBe("anonymous");
    });
  });
});

describe("User Class", () => {
  describe("authentication", () => {
    test("if user is not authenticated when user is not logged ", async () => {
      const user = new User(new MockFirebaseAuthService(new User(), false));
      expect(user.id).toBe("newUser");
      expect(user.authenticated).toBe(false);
      expect(user.role).toBe("anonymous");
      await user.isAuthenticated().then((result) => expect(result).toBe(false));
    });
    test("if user is authenticated when user is logged", async () => {
      const user = new User(new MockFirebaseAuthService(new User(), true));
      expect(user.id).toBe("newUser");
      expect(user.authenticated).toBe(false);
      expect(user.role).toBe("anonymous");
      await user.isAuthenticated().then((result) => {
        expect(result).toBe(true);
        expect(user.role).toBe("subscriber");
      });
    });
    test("if user is authenticate after successful log in", async () => {
      const user = new User(new MockFirebaseAuthService(new User(), true));
      expect(user.id).toBe("newUser");
      expect(user.authenticated).toBe(false);
      expect(user.role).toBe("anonymous");
      const loginResult = await user
        .login({
          username: "navid@email.com",
          password: "123456",
        })
        .then(() => {
          expect(user.id).toBe("user1");
          expect(user.username).toBe("navid@email.com");
          expect(user.authenticated).toBe(true);
          expect(user.role).toBe("subscriber");
        });
    });
  });
});

describe("Store Class", () => {
  describe("How Store  handles service not implemented error", () => {
    const store = new Store(new NotImplementedMockService<Category>());
    test("if getting items from store fails if store service is not implemented correctly", async () => {
      await store
        .getItems()
        .catch((e) => expect(e.message).toBe("Method not implemented."));
    });
    test("if getting item from store fails if store service is not implemented correctly", async () => {
      await store
        .getItem("xyz")
        .catch((e) => expect(e.message).toBe("Method not implemented."));
    });
    test("if calling create item from store fails if store service is not implemented correctly", async () => {
      await store
        .createItem(new Category())
        .catch((e) => expect(e.message).toBe("Method not implemented."));
    });
    test("if calling update item from store fails if store service is not implemented correctly", async () => {
      await store
        .updateItem(new Category())
        .catch((e) => expect(e.message).toBe("Method not implemented."));
    });
    test("if calling delete item from store fails if store service is not implemented correctly", async () => {
      await store
        .deleteItem(new Category())
        .catch((e) => expect(e.message).toBe("Method not implemented."));
    });
  });
  describe("How Store  handles service not connecting error", () => {
    const store = new Store(new NotConnectingMockService<Category>());
    test("if getting items from store fails if store service is not connecting", async () => {
      await store
        .getItems()
        .catch((e) => expect(e.message).toBe(ERROR_CODES.SERVICE_ERROR));
    });
    test("if getting item from store fails if store service is not connecting", async () => {
      await store
        .getItem("xyz")
        .catch((e) => expect(e.message).toBe(ERROR_CODES.SERVICE_ERROR));
    });
    test("if calling create item from store fails if store service is not connecting", async () => {
      await store
        .createItem(new Category())
        .catch((e) => expect(e.message).toBe(ERROR_CODES.SERVICE_ERROR));
    });
    test("if calling update item from store fails if store service is not connecting", async () => {
      await store
        .updateItem(new Category())
        .catch((e) => expect(e.message).toBe(ERROR_CODES.SERVICE_ERROR));
    });
    test("if calling delete item from store fails if store service is not connecting", async () => {
      await store
        .deleteItem(new Category())
        .catch((e) => expect(e.message).toBe(ERROR_CODES.SERVICE_ERROR));
    });
  });
  describe("How Store handles service unauthorized error", () => {
    test("if getting items from store fails if store user is not authorized to read items", async () => {
      const store = new Store(
        new MockFirebaseService(new Category(), undefined, {
          read: false,
          create: true,
          update: true,
          delete: true,
        })
      );
      await store
        .getItems()
        .catch((e) => expect(e.message).toBe(ERROR_CODES.UNAUTHORIZED));
    });
    test("if getting item from store fails if store user is not authorized to read items", async () => {
      const store = new Store(
        new MockFirebaseService(new Category(), undefined, {
          read: false,
          create: true,
          update: true,
          delete: true,
        })
      );
      await store
        .getItem("xyz")
        .catch((e) => expect(e.message).toBe(ERROR_CODES.UNAUTHORIZED));
    });
    test("if calling create item from store fails if store user is not authorized to create item", async () => {
      const store = new Store(
        new MockFirebaseService(new Category(), undefined, {
          read: true,
          create: false,
          update: true,
          delete: true,
        })
      );
      await store
        .createItem(new Category())
        .catch((e) => expect(e.message).toBe(ERROR_CODES.UNAUTHORIZED));
    });
    test("if calling update item from store fails if store user is not authorized to update item", async () => {
      const store = new Store(
        new MockFirebaseService(new Category(), undefined, {
          read: true,
          create: true,
          update: false,
          delete: true,
        })
      );
      await store
        .updateItem(new Category())
        .catch((e) => expect(e.message).toBe(ERROR_CODES.UNAUTHORIZED));
    });
    test("if calling delete item from store fails if store user is not authorized to delete item", async () => {
      const store = new Store(
        new MockFirebaseService(new Category(), undefined, {
          read: true,
          create: true,
          update: true,
          delete: false,
        })
      );
      await store
        .deleteItem(new Category())
        .catch((e) => expect(e.message).toBe(ERROR_CODES.UNAUTHORIZED));
    });
  });
  describe("How store allows public access", () => {
    test("if could read/write when service is public", async () => {
      const testStore = new Store(new MockFirebaseService(new Category()));
      let items = await testStore.getItems();
      expect(items.length).toBe(0);
      const cat = new Category();
      cat.title = "Phones";
      await testStore.createItem(cat);
      items = await testStore.getItems();
      expect(items.length).toBe(1);
      expect(items[0].title).toBe("Phones");
    });
  });
});
export {};
