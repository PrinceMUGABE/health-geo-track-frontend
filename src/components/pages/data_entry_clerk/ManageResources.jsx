import React, { useState, useEffect } from "react";
import {
  Eye,
  Trash2,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit,
  Download,
  FileText,
  FileSpreadsheet,
  FileInput,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/Dialog";

const Data_Entry_Clerk_ManageResources = () => {
  const [allocations, setAllocations] = useState([]);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [facilities, setFacilities] = useState([]);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);

  const [allocationData, setAllocationData] = useState({
    health_facility_id: "",
    equipment: "",
    specialist: "",
    duration_in_days: "",
  });

  const rowsOptions = [5, 10, 30, 50, 100];

  useEffect(() => {
    fetchAllocations();
    fetchFacilities();
  }, []);

  const filteredAllocations = allocations.filter(
    (allocation) =>
      allocation.health_facility?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      allocation.equipment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAllocations.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedAllocations = filteredAllocations.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const fetchAllocations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8000/resource_allocation/user/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAllocations(data);
      } else {
        setError("Failed to fetch resource allocations");
      }
    } catch (err) {
      setError("Error fetching resource allocations");
    } finally {
      setLoading(false);
    }
  };

  const fetchFacilities = async () => {
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
      }
    } catch (error) {
      console.error("Error fetching facilities:", error);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this resource allocation?"
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:8000/resource_allocation/delete/${id}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          setAllocations((prev) => prev.filter((a) => a.id !== id));
        } else {
          alert("Failed to delete resource allocation");
        }
      } catch (error) {
        alert("Error deleting resource allocation");
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8000/resource_allocation/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(allocationData),
        }
      );

      if (response.ok) {
        const newAllocation = await response.json();
        setAllocations([...allocations, newAllocation]);
        setShowCreateModal(false);
        setAllocationData({
          health_facility_id: "",
          equipment: "",
          specialist: "",
          duration_in_days: "",
        });
      } else {
        alert("Failed to create resource allocation");
      }
    } catch (error) {
      alert("Error creating resource allocation");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/resource_allocation/update/${selectedAllocation.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(allocationData),
        }
      );

      if (response.ok) {
        const updatedAllocation = await response.json();
        setAllocations(
          allocations.map((a) =>
            a.id === selectedAllocation.id ? updatedAllocation : a
          )
        );
        setShowUpdateModal(false);
        setAllocationData({
          health_facility_id: "",
          equipment: "",
          specialist: "",
          duration_in_days: "",
        });
        setSelectedAllocation(null);
      } else {
        alert("Failed to update resource allocation");
      }
    } catch (error) {
      alert("Error updating resource allocation");
    }
  };

  const handleEditAllocation = (allocation) => {
    setSelectedAllocation(allocation);
    setAllocationData({
      health_facility_id: allocation.health_facility.id,
      equipment: allocation.equipment,
      specialist: allocation.specialist,
      duration_in_days: allocation.duration_in_days,
    });
    setShowUpdateModal(true);
  };

  const downloadAllocations = async (format) => {
    if (allocations.length === 0) {
      alert("No resource allocations to download");
      return;
    }

    try {
      const processedData = allocations.map((a) => ({
        "Health Facility": a.health_facility?.name,
        equipment: a.equipment,
        "Personnel Count": a.specialist,
        "Duration (Days)": a.duration_in_days,
        "Created By": a.created_by?.email,
        "Created At": new Date(a.created_at).toLocaleDateString(),
      }));

      switch (format) {
        case "csv":
          downloadCSV(processedData);
          break;
        case "excel":
          downloadExcel(processedData);
          break;
        case "pdf":
          downloadPDF(processedData);
          break;
        default:
          alert("Invalid download format");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download resource allocations");
    }
  };

  // CSV Download Helper
  const downloadCSV = (data) => {
    const headers = Object.keys(data[0]).join(",");
    const csvContent = [
      headers,
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "resource_allocations.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Excel Download Helper
  const downloadExcel = (data) => {
    import("xlsx")
      .then((XLSX) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          "Resource Allocations"
        );
        XLSX.writeFile(workbook, "resource_allocations.xlsx");
      })
      .catch((error) => {
        console.error("Excel download error:", error);
        alert("Excel download requires 'xlsx' library. Please install it.");
      });
  };

  // PDF Download Helper
  const downloadPDF = (data) => {
    import("@react-pdf/renderer")
      .then(({ PDFDownloadLink, Document, Page, Text, View, StyleSheet }) => {
        const styles = StyleSheet.create({
          page: { padding: 20 },
          header: {
            fontSize: 16,
            marginBottom: 10,
            fontWeight: "bold",
          },
          row: {
            fontSize: 10,
            flexDirection: "row",
            borderBottom: "1 solid #000",
          },
        });

        const PDFContent = () => (
          <Document>
            <Page size="A4" style={styles.page}>
              <Text style={styles.header}>Resource Allocations Report</Text>
              {data.map((record, index) => (
                <View key={index} style={styles.row}>
                  <Text>
                    {record["Health Facility"]} - {record["equipment"]}
                  </Text>
                </View>
              ))}
            </Page>
          </Document>
        );

        const link = document.createElement("a");
        link.href = URL.createObjectURL(
          new Blob([<PDFContent />], { type: "application/pdf" })
        );
        link.download = "resource_allocations.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("PDF download error:", error);
        alert(
          "PDF download requires '@react-pdf/renderer' library. Please install it."
        );
      });
  };

  return (
    <div className="w-full ">
      <h1 className="text-xl font-bold mb-4 text-blue-700 text-center">
        RESOURCE ALLOCATION MANAGEMENT
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-sky-900 text-white rounded-md flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Resource Allocation</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
            className="px-4 py-2 bg-gray-900 text-white rounded-md flex items-center space-x-2 hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
          {showDownloadDropdown && (
            <div className="absolute z-10 mt-2 w-48 bg-white border text-gray-400 rounded-md shadow-lg">
              <button
                onClick={() => {
                  downloadAllocations("csv");
                  setShowDownloadDropdown(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
              >
                <FileInput className="mr-2 h-4 w-4" /> CSV
              </button>
              <button
                onClick={() => {
                  downloadAllocations("excel");
                  setShowDownloadDropdown(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel
              </button>
              <button
                onClick={() => {
                  downloadAllocations("pdf");
                  setShowDownloadDropdown(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
              >
                <FileText className="mr-2 h-4 w-4" /> PDF
              </button>
            </div>
          )}
        </div>

        <div className="relative w-full md:w-auto">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by facility or equipment..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-gray-400 md:w-auto pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && paginatedAllocations.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white rounded-lg">
            <thead className="bg-sky-900">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  #
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                  Health Facility
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                  Special Equipments
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                  Specialist
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                  Duration (Days)
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                  Created By
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                  Created At
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedAllocations.map((allocation, index) => (
                <tr
                  key={allocation.id}
                  className={
                    index % 2 === 0
                      ? "bg-gray-50"
                      : "bg-white hover:bg-gray-100"
                  }
                >
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {allocation.health_facility.name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {allocation.equipment}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {allocation.specialist}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {allocation.duration_in_days} days
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {allocation.created_by.email}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {new Date(allocation.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      onClick={() => handleEditAllocation(allocation)}
                      className="p-2 text-green-600 hover:text-green-800 rounded-lg hover:bg-green-50"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(allocation.id)}
                      className="p-2 text-black hover:text-red-800 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && paginatedAllocations.length === 0 && (
        <p className="text-center text-gray-500 my-4">
          No resource allocations found matching your search criteria.
        </p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border text-gray-700 rounded-md px-2 py-1"
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
          <span>
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

      {/* Modal for Create/Update Resource Allocation (similar to previous implementation) */}
      {/* Create/Update Resource Allocation Modal */}
      <Dialog
        open={showCreateModal || showUpdateModal}
        onOpenChange={() => {
          setShowCreateModal(false);
          setShowUpdateModal(false);
        }}
      >
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle className="text-center mt-4 mb-8 text-black font-bold">
              {showCreateModal
                ? "Add New Resource Allocation"
                : "Update Resource Allocation"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={showCreateModal ? handleCreate : handleUpdate}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Health Facility
                </label>
                <select
                  value={allocationData.health_facility_id}
                  onChange={(e) =>
                    setAllocationData({
                      ...allocationData,
                      health_facility_id: e.target.value,
                    })
                  }
                  className="mt-1 block text-gray-400 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Facility</option>
                  {facilities.map((facility) => (
                    <option key={facility.id} value={facility.id}>
                      {facility.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Equipment
                </label>
                <textarea
                  value={allocationData.equipment}
                  onChange={(e) =>
                    setAllocationData({
                      ...allocationData,
                      equipment: e.target.value,
                    })
                  }
                  className="mt-1 text-gray-400 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Specialist
                </label>
                <input
                  type="number"
                  min="0"
                  value={allocationData.specialist}
                  onChange={(e) =>
                    setAllocationData({
                      ...allocationData,
                      specialist: e.target.value,
                    })
                  }
                  className="mt-1 text-gray-400 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={allocationData.duration_in_days}
                  onChange={(e) =>
                    setAllocationData({
                      ...allocationData,
                      duration_in_days: e.target.value,
                    })
                  }
                  className="mt-1 text-gray-400 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setShowUpdateModal(false);
                  setAllocationData({
                    health_facility_id: "",
                    equipment: "",
                    specialist: "",
                    duration_in_days: "",
                  });
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {showCreateModal ? "Create" : "Update"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Data_Entry_Clerk_ManageResources;
