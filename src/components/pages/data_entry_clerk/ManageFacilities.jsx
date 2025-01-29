import React, { useState, useEffect, useRef } from "react";
import {
  Eye,
  Trash2,
  X,
  Download,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/Dialog";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Data_Entry_Clerk_Manage_Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const downloadRef = useRef(null);

  // Form states
  const [facilityData, setFacilityData] = useState({
    name: "",
    facility_type: "",
    district: "",
    sector: "",
    capacity: "",
    contact_number: "",
    status: "ACTIVE",
  });

  const facilityTypes = [
    ["HOSPITAL", "Hospital"],
    ["CLINIC", "Clinic"],
    ["HEALTH_CENTER", "Health Center"],
    ["PHARMACY", "Pharmacy"],
  ];

  const statusTypes = [
    ["ACTIVE", "Active"],
    ["INACTIVE", "Inactive"],
    ["MAINTENANCE", "Under Maintenance"],
    ["CLOSED", "Closed"],
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (downloadRef.current && !downloadRef.current.contains(event.target)) {
        setShowDownloadOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const rowsOptions = [5, 10, 30, 50, 100];

  const filteredFacilities = facilities.filter(
    (facility) =>
      facility.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.sector?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFacilities.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedFacilities = filteredFacilities.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const downloadExcel = () => {
    const dataToExport = filteredFacilities.map((f) => ({
      Name: f.name || "N/A",
      Type: f.facility_type || "N/A",
      District: f.district || "N/A",
      Sector: f.sector || "N/A",
      Capacity: f.capacity || "N/A",
      Status: f.status || "N/A",
      "Contact Number": f.contact_number || "N/A",
      "Created At": formatDate(f.created_at),
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Facilities");
    XLSX.writeFile(wb, "health_facilities.xlsx");
  };

  const downloadCSV = () => {
    const headers = [
      "Name,Type,District,Sector,Capacity,Status,Contact Number,Created At\n",
    ];
    const csv = filteredFacilities
      .map((f) =>
        [
          f.name || "N/A",
          f.facility_type || "N/A",
          f.district || "N/A",
          f.sector || "N/A",
          f.capacity || "N/A",
          f.status || "N/A",
          f.contact_number || "N/A",
          formatDate(f.created_at),
        ].join(",")
      )
      .join("\n");
    const blob = new Blob([headers + csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "health_facilities.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "Name",
          "Type",
          "District",
          "Sector",
          "Capacity",
          "Status",
          "Contact",
          "Created At",
        ],
      ],
      body: filteredFacilities.map((f) => [
        f.name || "N/A",
        f.facility_type || "N/A",
        f.district || "N/A",
        f.sector || "N/A",
        f.capacity || "N/A",
        f.status || "N/A",
        f.contact_number || "N/A",
        formatDate(f.created_at),
      ]),
    });
    doc.save("health_facilities.pdf");
  };

  const fetchFacilities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8000/facility/facilities/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFacilities(data);
      } else {
        setError("Failed to fetch facilities");
      }
    } catch (err) {
      setError("Error fetching facilities");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this facility?")) {
      try {
        const response = await fetch(
          `http://localhost:8000/facility/delete/${id}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          setFacilities((prev) =>
            prev.filter((facility) => facility.id !== id)
          );
        } else {
          alert("Failed to delete facility");
        }
      } catch (error) {
        alert("Error deleting facility");
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/facility/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(facilityData),
      });

      if (response.ok) {
        const newFacility = await response.json();
        setFacilities([...facilities, newFacility]);
        setShowCreateModal(false);
        setFacilityData({
          name: "",
          facility_type: "",
          district: "",
          sector: "",
          capacity: "",
          contact_number: "",
          status: "ACTIVE",
        });
      } else {
        alert("Failed to create facility");
      }
    } catch (error) {
      alert("Error creating facility");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/facility/update/${selectedFacility.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(facilityData),
        }
      );

      if (response.ok) {
        const updatedFacility = await response.json();
        setFacilities(
          facilities.map((f) =>
            f.id === selectedFacility.id ? updatedFacility : f
          )
        );
        setShowUpdateModal(false);
      } else {
        alert("Failed to update facility");
      }
    } catch (error) {
      alert("Error updating facility");
    }
  };

  const handleViewDetails = (id) => {
    const facility = facilities.find((f) => f.id === id);
    setSelectedFacility(facility);
    setShowModal(true);
  };

  const handleEditFacility = (facility) => {
    setSelectedFacility(facility);
    setFacilityData({
      name: facility.name,
      facility_type: facility.facility_type,
      district: facility.district,
      sector: facility.sector,
      capacity: facility.capacity,
      contact_number: facility.contact_number,
      status: facility.status,
    });
    setShowUpdateModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const renderMobileCard = (facility) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{facility.name}</h3>
          <p className="text-sm text-gray-500">{facility.facility_type}</p>
          <p className="text-sm text-gray-500">
            {facility.district}, {facility.sector}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              facility.status === "ACTIVE"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {facility.status}
          </span>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <button
          onClick={() => handleViewDetails(facility.id)}
          className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
        >
          <Eye className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleEditFacility(facility)}
          className="p-2 text-green-600 hover:text-green-800 rounded-lg hover:bg-green-50"
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleDelete(facility.id)}
          className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full px-12 ml-4">
      <h1 className="text-xl font-bold mb-4 text-blue-700 text-center">
        HEALTH FACILITY MANAGEMENT
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setShowCreateModal(true);
              setFacilityData({
                name: "",
                facility_type: "",
                district: "",
                sector: "",
                capacity: "",
                contact_number: "",
                status: "ACTIVE",
              });
            }}
            className="px-4 py-2 bg-sky-900 text-white rounded-md flex items-center space-x-2 hover:bg-black"
          >
            <Plus className="h-4 w-4" />
            <span>New Facility</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowDownloadOptions(!showDownloadOptions)}
              className="px-4 py-2 bg-green-400 text-white rounded-md flex items-center space-x-2 hover:bg-black"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
            {showDownloadOptions && (
              <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg">
                <div className="py-1">
                  <button
                    onClick={() => {
                      downloadPDF();
                      setShowDownloadOptions(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Download as PDF
                  </button>
                  <button
                    onClick={() => {
                      downloadExcel();
                      setShowDownloadOptions(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Download as Excel
                  </button>
                  <button
                    onClick={() => {
                      downloadCSV();
                      setShowDownloadOptions(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Download as CSV
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative w-full md:w-auto">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search facilities..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-gray-700 md:w-auto pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table and Mobile View */}
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && facilities.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full">
            {/* Mobile view */}
            <div className="lg:hidden space-y-4">
              {paginatedFacilities.map((facility) =>
                renderMobileCard(facility)
              )}
            </div>

            {/* Desktop view */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-sky-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Facility Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedFacilities.map((facility) => (
                    <tr key={facility.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {facility.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {facility.facility_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-gray-900">
                            {facility.district}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {facility.sector}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {facility.capacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            facility.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : facility.status === "MAINTENANCE"
                              ? "bg-yellow-100 text-yellow-800"
                              : facility.status === "INACTIVE"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {facility.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {facility.contact_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewDetails(facility.id)}
                            className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEditFacility(facility)}
                            className="p-2 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(facility.id)}
                            className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-2 md:space-y-0">
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border rounded-md px-2 py-1 text-gray-700"
        >
          {rowsOptions.map((option) => (
            <option key={option} value={option}>
              {option} rows
            </option>
          ))}
        </select>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5 text-blue-700" />
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {Math.max(1, totalPages)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5 text-blue-700" />
          </button>
        </div>
      </div>

      {/* Create Facility Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle className="text-black text-center font-bold">Create New Facility</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Facility Name
              </label>
              <input
                type="text"
                value={facilityData.name}
                onChange={(e) =>
                  setFacilityData({ ...facilityData, name: e.target.value })
                }
                className="mt-1 block text-gray-700 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Facility Type
              </label>
              <select
                value={facilityData.facility_type}
                onChange={(e) =>
                  setFacilityData({
                    ...facilityData,
                    facility_type: e.target.value,
                  })
                }
                className="mt-1 block w-full text-gray-700 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select type</option>
                {facilityTypes.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                District
              </label>
              <input
                type="text"
                value={facilityData.district}
                onChange={(e) =>
                  setFacilityData({ ...facilityData, district: e.target.value })
                }
                className="mt-1 block text-gray-700 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sector
              </label>
              <input
                type="text"
                value={facilityData.sector}
                onChange={(e) =>
                  setFacilityData({ ...facilityData, sector: e.target.value })
                }
                className="mt-1 block text-gray-700 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Capacity
              </label>
              <input
                type="number"
                value={facilityData.capacity}
                onChange={(e) =>
                  setFacilityData({ ...facilityData, capacity: e.target.value })
                }
                className="mt-1 block text-gray-700 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <input
                type="text"
                value={facilityData.contact_number}
                onChange={(e) =>
                  setFacilityData({
                    ...facilityData,
                    contact_number: e.target.value,
                  })
                }
                className="mt-1 block text-gray-700 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={facilityData.status}
                onChange={(e) =>
                  setFacilityData({ ...facilityData, status: e.target.value })
                }
                className="mt-1 block text-gray-700 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                {statusTypes.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-400 rounded-md hover:bg-black"
              >
                Create
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle className="text-center text-black font-bold">Facility Details</DialogTitle>
          </DialogHeader>

          {selectedFacility && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Facility Name
                  </h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedFacility.name}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Facility Type
                  </h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedFacility.facility_type}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    District
                  </h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedFacility.district}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Sector</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedFacility.sector}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Capacity
                  </h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedFacility.capacity}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Contact Number
                  </h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedFacility.contact_number}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <span
                    className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      selectedFacility.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : selectedFacility.status === "MAINTENANCE"
                        ? "bg-yellow-100 text-yellow-800"
                        : selectedFacility.status === "INACTIVE"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedFacility.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Created At
                  </h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(selectedFacility.created_at)}
                  </p>
                </div>
              </div>

              {/* Facility Statistics Chart */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Facility Usage Statistics
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: "Jan", usage: 65 },
                        { month: "Feb", usage: 75 },
                        { month: "Mar", usage: 85 },
                        { month: "Apr", usage: 70 },
                        { month: "May", usage: 80 },
                        { month: "Jun", usage: 90 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="usage"
                        stroke="#3b82f6"
                        name="Usage %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Facility Modal */}
      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle className="text-black">Update Facility</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Facility Name
              </label>
              <input
                type="text"
                value={facilityData.name}
                onChange={(e) =>
                  setFacilityData({ ...facilityData, name: e.target.value })
                }
                className="mt-1 block text-gray-700 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Facility Type
              </label>
              <select
                value={facilityData.facility_type}
                onChange={(e) =>
                  setFacilityData({
                    ...facilityData,
                    facility_type: e.target.value,
                  })
                }
                className="mt-1 block text-gray-700 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                required
              >
                {facilityTypes.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                District
              </label>
              <input
                type="text"
                value={facilityData.district}
                onChange={(e) =>
                  setFacilityData({ ...facilityData, district: e.target.value })
                }
                className="mt-1 block text-gray-700 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sector
              </label>
              <input
                type="text"
                value={facilityData.sector}
                onChange={(e) =>
                  setFacilityData({ ...facilityData, sector: e.target.value })
                }
                className="mt-1 block text-gray-700 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Capacity
              </label>
              <input
                type="number"
                value={facilityData.capacity}
                onChange={(e) =>
                  setFacilityData({ ...facilityData, capacity: e.target.value })
                }
                className="mt-1 block text-gray-700 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <input
                type="text"
                value={facilityData.contact_number}
                onChange={(e) =>
                  setFacilityData({
                    ...facilityData,
                    contact_number: e.target.value,
                  })
                }
                className="mt-1 text-gray-700 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={facilityData.status}
                onChange={(e) =>
                  setFacilityData({ ...facilityData, status: e.target.value })
                }
                className="mt-1 text-gray-700 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                required
              >
                {statusTypes.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-400 rounded-md hover:bg-black"
              >
                Update
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Data_Entry_Clerk_Manage_Facilities;
