import { Link } from "react-router-dom";

export const ForgetPassword = () => {
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

        <div className="flex justify-between items-center">
          <button type="submit" className="btn-primary">
            Search
          </button>
          <Link to="/auth/login" className="text-sm">
            Login
          </Link>
        </div>
        <Link to="/auth/signup">Sign up</Link>
      </form>
    </section>
  );
};
