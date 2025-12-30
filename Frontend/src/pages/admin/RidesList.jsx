import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";

const RideList = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}admin/rides`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        setRides(res.data.rides);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading rides...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]">
      {/* Sidebar */}
  
      <div className="flex-1 w-full">
        <AdminNavbar admin={{ name: "Super Admin" }} />

        <main className="p-4 md:p-6 overflow-y-auto">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            Rides
          </h1>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b">
                  <th className="py-3 px-4 font-medium">Passenger</th>
                  <th className="py-3 px-4 font-medium">Captain</th>
                  <th className="py-3 px-4 font-medium">Origin</th>
                  <th className="py-3 px-4 font-medium">Destination</th>
                  <th className="py-3 px-4 font-medium">Fare</th>
                  <th className="py-3 px-4 font-medium">Distance</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Payment</th>
                  <th className="py-3 px-4 font-medium">Created</th>
                </tr>
              </thead>

              <tbody>
                {rides.map((r, i) => (
                  <tr
                    key={r._id}
                    className={`border-b hover:bg-gray-100 transition ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="py-3 px-4 font-medium">
                      {r.userId?.fullname?.firstname}{" "}
                      {r.userId?.fullname?.lastname}
                    </td>
                    <td className="px-4">
                      {r.captain?.fullname?.firstname}{" "}
                      {r.captain?.fullname?.lastname}
                    </td>
                    <td className="px-4 text-gray-600 truncate max-w-[150px]">
                      {r.origin}
                    </td>
                    <td className="px-4 text-gray-600 truncate max-w-[150px]">
                      {r.destination}
                    </td>
                    <td className="px-4 text-gray-900 font-semibold">
                      ₹{r.fare?.toFixed(2)}
                    </td>
                    <td className="px-4 text-gray-700">
                      {(r.distance / 1000).toFixed(2)} km
                    </td>
                    <td className="px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          r.status === "COMPLETED"
                            ? "bg-green-100 text-green-600"
                            : r.status === "ONGOING"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4">
                      {r.paymentStatus === "PAID" ? (
                        <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                          Paid
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                          Unpaid
                        </span>
                      )}
                    </td>
                    <td className="px-4 text-gray-600">
                      {new Date(r.createdAt).toLocaleDateString()}
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

export default RideList;
