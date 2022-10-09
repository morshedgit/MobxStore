import { Link } from "react-router-dom";

export const Login = () => {
  return (
    <section className="w-full h-full flex justify-center items-center">
      <form className="p-4 shadow-lg rounded-lg flex flex-col gap-2">
        <h1 className="text-3xl">Welcome!</h1>
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
      </form>
    </section>
  );
};
