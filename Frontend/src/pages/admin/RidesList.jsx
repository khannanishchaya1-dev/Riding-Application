import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";

const RideList = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const filteredRides = rides.filter((r) =>
    r._id?.toLowerCase().includes(search.toLowerCase())
  );

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
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminNavbar admin={{ name: "Super Admin" }} />

     <main className="p-4 h-[calc(100vh-70px)] overflow-y-auto no-scrollbar">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 max-w-3xl mx-auto">
  <h1 className="text-lg font-semibold text-gray-800">Rides</h1>

  <input
    type="text"
    placeholder="Search by ride ID..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full sm:w-64 px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>
       <div className="space-y-4 max-w-3xl mx-auto">
          {filteredRides.map((r) => (
            <div
              key={r._id}
              className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">
                    {r.userId?.fullname?.firstname} {r.userId?.fullname?.lastname}
                  </p>
                  <p className="text-xs text-gray-500">
                    Captain: {r.captain?.fullname?.firstname || "Not Assigned"}
                  </p>
                </div>

                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    r.status === "COMPLETED"
                      ? "bg-green-100 text-green-600"
                      : r.status === "ONGOING"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              {/* Route */}
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">From:</span> {r.origin}</p>
                <p><span className="font-medium">To:</span> {r.destination}</p>
              </div>

              {/* Ride Details */}
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Fare:</span> ₹{r.fare?.toFixed(2)}</p>
                <p><span className="font-medium">Distance:</span> {(r.distance).toFixed(2)} km</p>
                <p>
                  <span className="font-medium">Payment:</span>{" "}
                  <span
                    className={
                      r.paymentStatus === "PAID"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {r.paymentStatus}
                  </span>
                </p>
              </div>

              {/* Footer */}
              <div className="mt-3 flex justify-between text-xs text-gray-500">
                <span>#{r._id.slice(0, 7).toUpperCase()}</span>
                <span>{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredRides.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No matching rides found</p>
        )}
      </main>
    </div>
  );
};

export default RideList;
