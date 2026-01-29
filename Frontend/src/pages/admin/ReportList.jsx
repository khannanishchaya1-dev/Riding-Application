import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import toast from "react-hot-toast";

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [search, setSearch] = useState("");
const filteredReports = reports.filter((r) =>
  r.rideId?._id?.toLowerCase().includes(search.toLowerCase())
);



  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}admin/reports`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        setReports(res.data.reports);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);
  const updateReportStatus = async (id, status) => {
  try {
    const result = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}admin/report-status/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      }
    );
    if(result.data.success === true){
      toast.success(result.data.message);
    
    setReports((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status } : r))
    );

    setSelectedReport(null);
  }
  } catch (err) {
    console.log(err);
  }
};


  const statusStyle = (status) => {
    switch (status) {
      case "RESOLVED":
        return "bg-green-100 text-green-600";
      case "UNDER_REVIEW":
        return "bg-blue-100 text-blue-600";
      case "REJECTED":
        return "bg-red-100 text-red-600";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminNavbar admin={{ name: "Super Admin" }} />

      <main className="p-4 h-[calc(100vh-70px)] overflow-y-auto no-scrollbar">


        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
  <h1 className="text-lg font-semibold text-gray-800">Reports</h1>

  <input
    type="text"
    placeholder="Search by Ride ID..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full sm:w-64 px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>


        <div className="space-y-4 max-w-3xl mx-auto">

          {filteredReports.map((r) => (
            <div
              key={r._id}
              className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">
                    Ride #{r.rideId?._id?.slice(0, 7).toUpperCase() || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyle(
                    r.status
                  )}`}
                >
                  {r.status}
                </span>
              </div>

              {/* Reporter Info */}
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Reported By:</span>{" "}
                  {r.reporterType} —{" "}
                  {r.reportedBy?.email || r.reportedBy?._id}
                </p>
                <p>
                  <span className="font-medium">Reported User:</span>{" "}
                  {r.reportedUserType} —{" "}
                  {r.reportedUser?.email || r.reportedUser?._id}
                </p>
              </div>

              {/* Reason */}
              <div className="mt-3 text-sm text-gray-700">
                <p className="font-medium mb-1">Reason:</p>
                <p className="text-gray-600 line-clamp-3" title={r.reason}>
                  {r.reason}
                </p>
              </div>
              <button
  onClick={() => setSelectedReport(r)}
  className="mt-4 w-full py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50"
>
  View Details
</button>

            </div>
            
          ))}
          
        </div>

       {filteredReports.length === 0 && (
  <p className="text-center text-gray-500 mt-6">No matching reports found</p>
)}

      </main>
      {selectedReport && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl w-[90%] max-w-md p-5 shadow-lg">
      <h2 className="text-lg font-semibold mb-2">Report Details</h2>

      <p className="text-sm text-gray-600 mb-1">
        <b>Ride:</b> #{selectedReport.rideId?._id?.slice(0,7).toUpperCase()}
      </p>

      <p className="text-sm text-gray-600 mb-1">
        <b>Reported By:</b> {selectedReport.reporterType} —{" "}
        {selectedReport.reportedBy?.email}
      </p>

      <p className="text-sm text-gray-600 mb-1">
        <b>Reported User:</b> {selectedReport.reportedUserType} —{" "}
        {selectedReport.reportedUser?.email}
      </p>

      <div className="mt-3">
        <p className="font-medium text-sm">Reason:</p>
        <p className="text-sm text-gray-600 mt-1">
          {selectedReport.reason}
        </p>
      </div>

      <div className="flex gap-2 mt-5">
  {/* If report is PENDING */}
  {selectedReport.status === "PENDING" && (
    <>
      <button
        onClick={() => updateReportStatus(selectedReport._id, "UNDER_REVIEW")}
        className="flex-1 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium"
      >
        Mark Under Review
      </button>

      <button
        onClick={() => updateReportStatus(selectedReport._id, "REJECTED")}
        className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-medium"
      >
        Reject
      </button>
    </>
  )}

  {/* If report is UNDER REVIEW */}
  {selectedReport.status === "UNDER_REVIEW" && (
    <>
      <button
        onClick={() => updateReportStatus(selectedReport._id, "RESOLVED")}
        className="flex-1 py-2 rounded-lg bg-green-500 text-white text-sm font-medium"
      >
        Resolve
      </button>

      <button
        onClick={() => updateReportStatus(selectedReport._id, "REJECTED")}
        className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-medium"
      >
        Reject
      </button>
    </>
  )}
</div>


      <button
        onClick={() => setSelectedReport(null)}
        className="mt-3 w-full text-xs text-gray-500"
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default ReportList;
