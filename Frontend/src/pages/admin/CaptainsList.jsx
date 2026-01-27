import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import toast from "react-hot-toast";

const CaptainsList = () => {
  const [captains, setCaptains] = useState([]);
  const [loading, setLoading] = useState(true);

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
  const blockUnblockCaptain = async (id)=>{
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}admin/block-captain/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if(response.data.success){
        toast.success(response.data.message);
        setCaptains((prevCaptains) =>
          prevCaptains.map((c) =>
            c._id === id ? { ...c, blocked: !c.blocked }:c
          )
        );
      }else{
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error blocking captain:", error.message);
      toast.error("Something went wrong");
    }
  }

  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading captains...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]">
      {/* Sidebar */}
      

      {/* Main */}
      <div className="flex-1 w-full">
        <AdminNavbar admin={{ name: "Super Admin" }} />

        <main className="p-4 md:p-6 overflow-y-auto">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            Captains
          </h1>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b">
                  <th className="py-3 px-4 font-medium">Name</th>
                  <th className="py-3 px-4 font-medium">Email</th>
                  <th className="py-3 px-4 font-medium">Phone</th>
                  <th className="py-3 px-4 font-medium">Vehicle</th>
                  <th className="py-3 px-4 font-medium">Plate</th>
                  <th className="py-3 px-4 font-medium">Capacity</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Verified</th>
                  <th className="py-3 px-4 font-medium w-32">Action</th>
                </tr>
              </thead>

              <tbody>
                {captains.map((c, i) => (
                  <tr
                    key={c._id}
                    className={`border-b hover:bg-gray-100 transition ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="py-3 px-4 font-medium">
                      {c.fullname?.firstname} {c.fullname?.lastname}
                    </td>
                    <td className="px-4 text-gray-600">{c.email}</td>
                    <td className="px-4 text-gray-600">{c.phone}</td>
                    <td className="px-4 text-gray-600">
                      {c.vehicle?.vehicleModel} ({c.vehicle?.vehicleType})
                    </td>
                    <td className="px-4 text-gray-600">
                      {c.vehicle?.numberPlate}
                    </td>
                    <td className="px-4 text-gray-600">
                      {c.vehicle?.capacity}
                    </td>
                    <td className="px-4">
                      {c.status ? (
                        <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                          Blocked
                        </span>
                      )}
                    </td>
                    <td className="px-4">
                      {c.isVerified ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs font-medium">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4">
                      <button
                        onClick={() => blockUnblockCaptain(c._id)}
                        className={`w-full sm:w-auto px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                          c.blocked
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                      >
                        {c.blocked ? "Unblock" : "Block"}
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
"bg-red-500 text-white hover:bg-red-600"
export default CaptainsList;
