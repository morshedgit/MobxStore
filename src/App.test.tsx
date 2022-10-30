import { User } from "./Models/Common";
import { FirebaseAuthService } from "./services/firebase";

test("that jest is working", () => {
  expect(true).toBe(true);
});

test("Can create a user", async () => {
  const user = new User(new FirebaseAuthService(new User()));
  expect(user.id).toBe("newUser");
  expect(user.authenticated).toBe(false);
  const isReady = await user.service?.isReady();
  expect(isReady).toBe(false || undefined);
  const loginResult = await user.login({
    username: "sina@email.com",
    password: "123456",
  });
  expect(user.authenticated).toBe(true);
});
export {};
