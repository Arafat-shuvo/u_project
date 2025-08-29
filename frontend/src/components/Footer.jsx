import { FaGraduationCap } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#2f80ed] text-white py-4 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-sm font-medium">
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-full mr-3 shadow-sm">
              <FaGraduationCap className="text-[#2f80ed] " />
            </div>
            <h1 className="text-xl font-bold">Study Portal</h1>
          </div>
        </div>

        {/* Middle - Copyright */}
        <div className="text-sm">
          <p>© 2025 Study Portal. All rights reserved.</p>
        </div>

        <div className="text-sm">
          <p>— </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
