import { Form, Link, useRouteError } from "react-router-dom";

export const Login = () => {
  let error = useRouteError() as any;
  return (
    <section className="w-full h-full flex justify-center items-center">
      <Form
        method="post"
        className="p-4 shadow-lg rounded-lg flex flex-col gap-2"
        action="/auth/login"
      >
        <h1 className="text-3xl">Welcome!</h1>
        {error && (
          <section className="rounded-md bg-red-300 text-red-700 p-2">
            {error.message}
          </section>
        )}
        <fieldset className="flex justify-between">
          <label htmlFor="username" className="text-right">
            Username:
          </label>
          <input
            type="text"
            name="username"
            id="username"
            className="border rounded-lg p-1 px-2"
            placeholder="john@email.com"
          />
        </fieldset>
        <fieldset className="flex justify-between">
          <label htmlFor="password" className="text-right">
            Password:
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="border rounded-lg p-1 px-2"
          />
        </fieldset>
        <div className="flex justify-between items-center">
          <button type="submit" className="btn-primary">
            Login
          </button>
          <Link to="/auth/forget-password" className="text-sm">
            Forget your password?
          </Link>
        </div>
        <Link to="/auth/signup">Sign up</Link>
      </Form>
    </section>
  );
};
