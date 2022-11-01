import { Category } from "./Models/Ad";
import { ERROR_CODES, Store, User } from "./Models/Common";
import {
  MockFirebaseAuthService,
  MockFirebaseService,
  NotConnectingMockService,
  NotImplementedMockService,
} from "./services/mockServices";

test("if user is not logged", async () => {
  const user = new User(new MockFirebaseAuthService(new User(), false));
  expect(user.id).toBe("newUser");
  expect(user.authenticated).toBe(false);
  expect(user.role).toBe("anonymous");
  const isAuth = await user.isAuthenticated();
  expect(isAuth).toBe(false);
});
test("if user is logged", async () => {
  const user = new User(new MockFirebaseAuthService(new User(), true));
  expect(user.id).toBe("newUser");
  expect(user.authenticated).toBe(false);
  expect(user.role).toBe("anonymous");
  const isAuth = await user.isAuthenticated();
  expect(isAuth).toBe(true);
  expect(user.role).toBe("subscriber");
});
test("if could log in", async () => {
  const user = new User(new MockFirebaseAuthService(new User(), false));
  expect(user.id).toBe("newUser");
  expect(user.authenticated).toBe(false);
  expect(user.role).toBe("anonymous");
  const loginResult = await user.login({
    username: "navid@email.com",
    password: "123456",
  });
  expect(user.id).toBe("TestUser");
  expect(user.username).toBe("navid@email.com");
  expect(user.authenticated).toBe(true);
  expect(user.role).toBe("subscriber");
});

describe("Store Class", () => {
  describe("How Store  handles service not implemented error", () => {
    const store = new Store(new NotImplementedMockService<Category>());
    test("if getting items from store fails if store service is not implemented correctly", async () => {
      expect(async () => await store.getItems()).rejects.toThrow(
        "Method not implemented."
      );
    });
    test("if getting item from store fails if store service is not implemented correctly", async () => {
      expect(async () => await store.getItem("xyz")).rejects.toThrow(
        "Method not implemented."
      );
    });
    test("if calling create item from store fails if store service is not implemented correctly", async () => {
      expect(
        async () => await store.createItem(new Category())
      ).rejects.toThrow("Method not implemented.");
    });
    test("if calling update item from store fails if store service is not implemented correctly", async () => {
      expect(
        async () => await store.updateItem(new Category())
      ).rejects.toThrow("Method not implemented.");
    });
    test("if calling delete item from store fails if store service is not implemented correctly", async () => {
      expect(
        async () => await store.deleteItem(new Category())
      ).rejects.toThrow("Method not implemented.");
    });
  });
  describe("How Store  handles service not connecting error", () => {
    const store = new Store(new NotConnectingMockService<Category>());
    test("if getting items from store fails if store service is not connecting", async () => {
      expect(async () => await store.getItems()).rejects.toThrow(
        ERROR_CODES.SERVICE_ERROR
      );
    });
    test("if getting item from store fails if store service is not connecting", async () => {
      expect(async () => await store.getItem("xyz")).rejects.toThrow(
        ERROR_CODES.SERVICE_ERROR
      );
    });
    test("if calling create item from store fails if store service is not connecting", async () => {
      expect(
        async () => await store.createItem(new Category())
      ).rejects.toThrow(ERROR_CODES.SERVICE_ERROR);
    });
    test("if calling update item from store fails if store service is not connecting", async () => {
      expect(
        async () => await store.updateItem(new Category())
      ).rejects.toThrow(ERROR_CODES.SERVICE_ERROR);
    });
    test("if calling delete item from store fails if store service is not connecting", async () => {
      expect(
        async () => await store.deleteItem(new Category())
      ).rejects.toThrow(ERROR_CODES.SERVICE_ERROR);
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
      expect(async () => await store.getItems()).rejects.toThrow(
        ERROR_CODES.UNAUTHORIZED
      );
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
      expect(async () => await store.getItem("xyz")).rejects.toThrow(
        ERROR_CODES.UNAUTHORIZED
      );
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
      expect(
        async () => await store.createItem(new Category())
      ).rejects.toThrow(ERROR_CODES.UNAUTHORIZED);
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
      expect(
        async () => await store.updateItem(new Category())
      ).rejects.toThrow(ERROR_CODES.UNAUTHORIZED);
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
      expect(
        async () => await store.deleteItem(new Category())
      ).rejects.toThrow(ERROR_CODES.UNAUTHORIZED);
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
