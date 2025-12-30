import React, { useState, useEffect } from "react";
import axios from "axios";

import AdminNavbar from "./AdminNavbar";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH USERS
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

  // Block / Unblock Local Toggle
  const toggleBlock = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u._id === id ? { ...u, isBlocked: !u.isBlocked } : u
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading users...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]">
      
      {/* Main Content */}
      <div className="flex-1 w-full">
        <AdminNavbar admin={{ name: "Super Admin" }} />

        <main className="p-4 md:p-6 overflow-y-auto">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            Users
          </h1>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b">
                  <th className="py-3 px-4 font-medium">Name</th>
                  <th className="py-3 px-4 font-medium">Email</th>
                  <th className="py-3 px-4 font-medium">Phone</th>
                  <th className="py-3 px-4 font-medium">Verified</th>
                  <th className="py-3 px-4 font-medium">Created</th>
                  <th className="py-3 px-4 font-medium w-32">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u, i) => (
                  <tr
                    key={u._id}
                    className={`border-b hover:bg-gray-100 transition ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="py-3 px-4 font-medium">
                      {u.fullname?.firstname} {u.fullname?.lastname}
                    </td>
                    <td className="px-4 text-gray-600">{u.email}</td>
                    <td className="px-4 text-gray-600">{u.phone}</td>
                    <td className="px-4">
                      {u.isVerified ? (
                        <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs font-medium">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 text-gray-600">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4">
                      <button
                        onClick={() => toggleBlock(u._id)}
                        className={`w-full sm:w-auto px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                          u.isBlocked
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                      >
                        {u.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UsersList;
