import { User } from "./Models/Common";
import { MockFirebaseAuthService } from "./services/mockServices";

test("if user is logged", async () => {
  const user = new User(new MockFirebaseAuthService(new User(), true));
  expect(user.id).toBe("newUser");
  expect(user.authenticated).toBe(false);
  expect(user.role).toBe("anonymous");
  expect(user.role).toBe("subscriber");
});
test("test if could log in", async () => {
  const user = new User(new MockFirebaseAuthService(new User(), false));
  expect(user.id).toBe("newUser");
  expect(user.authenticated).toBe(false);
  expect(user.role).toBe("anonymous");
  const isReady = await user.service?.isReady();
  expect(isReady).toBe(false);
  const loginResult = await user.login({
    username: "sina@email.com",
    password: "123456",
  });
  expect(user.id).toBe("TestUser");
  expect(user.username).toBe("sina@email.com");
  expect(user.authenticated).toBe(true);
  expect(user.role).toBe("subscriber");
});
export {};
