import { Link } from "react-router-dom";
import { HeaderAccountMenu } from "./HeaderAccountMenu";

export const Header = (props: { onMenuToggle?: () => void }) => {
  return (
    <header className="flex gap-4 h-12 bg-slate-800 items-center justify-between text-slate-50 p-2">
      <div className="w-full h-full flex items-center gap-4">
        <button
          type="button"
          className="flex md:hidden"
          onClick={() => props.onMenuToggle?.()}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <Link to="/">
          <span className="material-symbols-outlined">home</span>
        </Link>
        <p>My React/Mobx/React Router/Tailwind Design</p>
      </div>
      <HeaderAccountMenu />
    </header>
  );
};
