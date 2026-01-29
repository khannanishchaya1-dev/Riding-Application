import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import toast from "react-hot-toast";

const CaptainsList = () => {
  const [captains, setCaptains] = useState([]);
  const [loading, setLoading] = useState(true);
   const [search, setSearch] = useState("");
  const filteredCaptains = captains.filter((c) =>
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchCaptains = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}admin/captains`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        setCaptains(res.data.captains);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCaptains();
  }, []);

  const blockUnblockCaptain = async (id) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}admin/block-captain/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setCaptains((prev) =>
          prev.map((c) =>
            c._id === id ? { ...c, blocked: !c.blocked } : c
          )
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
        Loading captains...
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
          {filteredCaptains.map((c) => (
            <div
              key={c._id}
              className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">
                    {c.fullname?.firstname} {c.fullname?.lastname}
                  </p>
                  <p className="text-sm text-gray-500">{c.email}</p>
                  <p className="text-sm text-gray-500">{c.phone}</p>
                </div>

                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    c.status
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {c.status ? "Active" : "Blocked"}
                </span>
              </div>

              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Vehicle:</span>{" "}
                  {c.vehicle?.vehicleModel} ({c.vehicle?.vehicleType})
                </p>
                <p>
                  <span className="font-medium">Plate:</span>{" "}
                  {c.vehicle?.numberPlate}
                </p>
                <p>
                  <span className="font-medium">Capacity:</span>{" "}
                  {c.vehicle?.capacity}
                </p>
                <p>
                  <span className="font-medium">Verified:</span>{" "}
                  <span
                    className={
                      c.isVerified
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }
                  >
                    {c.isVerified ? "Yes" : "Pending"}
                  </span>
                </p>
              </div>

              <button
                onClick={() => blockUnblockCaptain(c._id)}
                className={`mt-4 w-full py-2 rounded-lg text-sm font-medium transition ${
                  c.blocked
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                {c.blocked ? "Unblock Captain" : "Block Captain"}
              </button>
            </div>
          ))}
        </div>

        {filteredCaptains.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No matching captains found</p>
        )}
      </main>
    </div>
  );
};

export default CaptainsList;
