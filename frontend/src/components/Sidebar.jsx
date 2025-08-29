import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();
  const item = (to, label) => (
    <Link
      to={to}
      className={`block px-3 py-2 rounded hover:bg-gray-100 ${
        pathname === to ? "bg-gray-100 font-medium" : ""
      }`}
    >
      {label}
    </Link>
  );

  return (
    <aside className="hidden md:block w-56 border-r bg-white min-h-[calc(100vh-56px)] p-3">
      <div className="text-sm text-gray-500 uppercase mb-2">Menu</div>
      <nav className="space-y-1">
        {item("/", "Home")}
        {item("/admin", "Admin Upload")}
      </nav>
    </aside>
  );
}
