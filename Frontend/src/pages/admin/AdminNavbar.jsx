import React, { useContext,useEffect } from "react";
import { FiBell } from "react-icons/fi";
import { MdOutlineLogout } from "react-icons/md";
import { AdminContext } from "../../AdminContext/AdminContext";

const AdminNavbar = () => {
  const { admin, setAdmin } = useContext(AdminContext);
 
const adminData = JSON.parse(localStorage.getItem("admin"));
  return (
    <nav className="w-full bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      
      {/* Left */}
      <h2 className="text-lg md:text-xl font-semibold text-gray-800">
        Admin Panel
      </h2>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Notification */}
        <button className="relative text-gray-600 hover:text-black transition">
          <FiBell size={20} />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <img
            src={`https://ui-avatars.com/api/?name=${adminData?.name || "Admin"}&background=random`}
            alt="admin avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {admin?.name || "Admin"}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            setAdmin(null);   // Clear admin from context
            window.location.href = "/admin/login";
          }}
          className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-medium"
        >
          <MdOutlineLogout size={18} />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
