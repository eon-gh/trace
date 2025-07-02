import { Link } from "react-router-dom";

const NavigationBar = () => {
  return (
    <div className="fixed bottom-6 left-6 backdrop-blur-md bg-zinc-900/80 border border-zinc-700 rounded-2xl px-4 py-3 shadow-2xl z-50 w-[100px] flex flex-col gap-3 font-mono text-sm text-zinc-200">
      <Link
        to="/"
        className="hover:text-cyan-400 transition-colors duration-200"
      >
        Home
      </Link>
      <Link
        to="/about"
        className="hover:text-cyan-400 transition-colors duration-200"
      >
        About
      </Link>
      <Link
        to="/support"
        className="hover:text-cyan-400 transition-colors duration-200"
      >
        Support
      </Link>
    </div>
  );
};

export default NavigationBar;
