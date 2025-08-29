
import { useState, useEffect } from "react";
import { FaLock, FaUserAlt, FaTimes, FaSignInAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ open, onClose }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const navigation = useNavigate();
  const { login } = useAuth();
  useEffect(() => {
    if (open) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [open]);

  if (!open) return null;

  // const submit = (e) => {
  //   e.preventDefault();
  //   const { ok, error } = login(user, pass);
  //   if (!ok) alert(error);
  //   else onClose();
  // };

  const submit = (e) => {
    e.preventDefault();
    const { ok } = login(user, pass);
    console.log(ok);
    if (ok) {
      toast.success(`Successfully Login`);
      navigation("/admin");
    }
    onClose();
  };

  return (
    <div className="fixed  inset-0 z-30 bg-black/50 flex items-center justify-center p-4">
      <div
        className={`bg-white w-full max-w-md rounded-xl p-5 transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-2 border-b border-[#e3f2fd]">
          <div className="flex items-center">
            <div className="bg-[#e3f2fd] p-2 rounded-lg mr-3">
              <FaUserAlt className="text-[#2f80ed]" />
            </div>
            <h3 className="text-xl font-semibold text-[#2f80ed]">
              Login to Study Portal
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
          >
            <FaTimes />
          </button>
        </div>

       
        <form className="space-y-4" onSubmit={submit}>
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 transition-all duration-200 focus-within:border-[#2f80ed] focus-within:ring-2 ring-[#e3f2fd]">
            <FaUserAlt className="text-gray-400 mr-2" />
            <input
              className="w-full outline-none bg-transparent"
              placeholder="Username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>

          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 transition-all duration-200 focus-within:border-[#2f80ed] focus-within:ring-2 ring-[#e3f2fd]">
            <FaLock className="text-gray-400 mr-2" />
            <input
              className="w-full outline-none bg-transparent"
              placeholder="Password"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-gradient-to-r from-[#2f80ed] to-[#2d9ee0] text-white font-medium py-2.5 rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <FaSignInAlt />
            Sign In
          </button>
        </form>

        {/* Footer */}
        {/* <div className="mt-4 pt-3 border-t border-[#e3f2fd] text-center">
          <p className="text-xs text-gray-500">
            Don't have an account?{" "}
            <span className="text-[#2f80ed] cursor-pointer hover:underline">
              Contact administrator
            </span>
          </p>
        </div> */}
      </div>
    </div>
  );
}
