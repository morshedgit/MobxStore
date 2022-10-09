import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="flex gap-4 h-12 bg-slate-800 items-center text-slate-50 p-2">
      <Link to="/">
        <span className="material-symbols-outlined">home</span>
      </Link>
      <p>My React/Mobx/React Router/Tailwind Design</p>
    </header>
  );
};
