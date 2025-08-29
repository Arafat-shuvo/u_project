// Navbar.jsx
import { useState } from "react";
import LoginModal from "./LoginModal";
import { FaUserCircle, FaGraduationCap, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const isAdmin = localStorage.getItem("isLogin");
  console.log(isAdmin);
  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Banner */}
      <header className="w-full container mx-auto bg-gradient-to-r from-[#2f80ed] to-[#2d9ee0] text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to={"/"}>
            <div className="flex items-center">
              <div className="bg-white p-2 rounded-full mr-3 shadow-sm">
                <FaGraduationCap className="text-[#2f80ed] text-xl" />
              </div>
              <h1 className="text-xl font-bold">Study Portal</h1>
            </div>
          </Link>

          <div className="hidden md:flex flex-col items-center">
            <p className="text-sm font-medium">
              By <span className="font-semibold">Your Name</span>
            </p>
            <p className="text-xs opacity-90">
              Course: <span className="font-medium">Your Course</span>
            </p>
          </div>

          <div>
            {isAdmin ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link to={'/admin'} className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white text-[#2f80ed] hover:bg-[#e3f2fd] transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <FaSignOutAlt size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setOpen(true)}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white text-[#2f80ed] hover:bg-[#e3f2fd] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <FaUserCircle size={16} />
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
