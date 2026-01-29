import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminNavbar from "./AdminNavbar";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
const filteredUsers = users.filter((u) =>
  u.email?.toLowerCase().includes(search.toLowerCase())
);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}admin/users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        setUsers(res.data.users);
      } catch (error) {
        console.log("Error fetching users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const blockUnblockUser = async (id) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}admin/block-user/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, blocked: !u.blocked } : u))
        );
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-sm">
        Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminNavbar admin={{ name: "Super Admin" }} />

     <main className="p-4 h-[calc(100vh-70px)] overflow-y-auto no-scrollbar">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 max-w-3xl mx-auto">
  <h1 className="text-lg font-semibold text-gray-800">Users</h1>

  <input
    type="text"
    placeholder="Search by email..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full sm:w-64 px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>


  <div className="space-y-4 max-w-3xl mx-auto">
    {filteredUsers.map((u) => (
      <div
        key={u._id}
        className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-gray-800">
              {u.fullname?.firstname} {u.fullname?.lastname}
            </p>
            <p className="text-sm text-gray-500">{u.email}</p>
            <p className="text-sm text-gray-500">{u.phone}</p>
          </div>

          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              u.isVerified
                ? "bg-green-100 text-green-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {u.isVerified ? "Verified" : "Pending"}
          </span>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Joined: {new Date(u.createdAt).toLocaleDateString()}
        </p>

        <button
          onClick={() => blockUnblockUser(u._id)}
          className={`mt-4 w-full py-2 rounded-lg text-sm font-medium transition ${
            u.blocked
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          {u.blocked ? "Unblock User" : "Block User"}
        </button>
      </div>
    ))}
  </div>

  {filteredUsers.length === 0 && (
    <p className="text-center text-gray-500 mt-6">No matching users found</p>
  )}
</main>

    </div>
  );
};

export default UsersList;
