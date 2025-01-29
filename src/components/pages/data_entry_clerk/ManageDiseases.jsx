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

const Data_Entry_Clerk_ManageDiseases = () => {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [facilities, setFacilities] = useState([]);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);

  const [incidentData, setIncidentData] = useState({
    disease_name: "",
    health_facility_id: "",
    number_of_cases: "",
    status: "ACTIVE",
    description: "",
  });

  const statusOptions = [
    ["ACTIVE", "Active"],
    ["RESOLVED", "Resolved"],
    ["UNDER_INVESTIGATION", "Under Investigation"],
    ["CONTAINED", "Contained"],
  ];

  const rowsOptions = [5, 10, 30, 50, 100];

  useEffect(() => {
    fetchIncidents();
    fetchFacilities();
  }, []);

  const filteredIncidents = incidents.filter(
    (incident) =>
      incident.disease_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.health_facility?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
    incident.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.created_by?.phone_number?.toLowerCase().includes(searchTerm.toLowerCase())

  );

  const totalPages = Math.ceil(filteredIncidents.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedIncidents = filteredIncidents.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8000/incident/incidents/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIncidents(data);
      } else {
        setError("Failed to fetch incidents");
      }
    } catch (err) {
      setError("Error fetching incidents");
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
    if (window.confirm("Are you sure you want to delete this incident?")) {
      try {
        const response = await fetch(
          `http://localhost:8000/incident/${id}/delete/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          setIncidents((prev) => prev.filter((incident) => incident.id !== id));
        } else {
          alert("Failed to delete incident");
        }
      } catch (error) {
        alert("Error deleting incident");
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/incident/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(incidentData),
      });

      if (response.ok) {
        const newIncident = await response.json();
        setIncidents([...incidents, newIncident]);
        setShowCreateModal(false);
        setIncidentData({
          disease_name: "",
          health_facility_id: "",
          number_of_cases: "",
          status: "ACTIVE",
          description: "",
        });
      } else {
        alert("Failed to create incident");
      }
    } catch (error) {
      alert("Error creating incident");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/incident/${selectedIncident.id}/update/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(incidentData),
        }
      );

      if (response.ok) {
        const updatedIncident = await response.json();
        setIncidents(
          incidents.map((inc) =>
            inc.id === selectedIncident.id ? updatedIncident : inc
          )
        );
        setShowUpdateModal(false);
        setIncidentData({
          disease_name: "",
          health_facility_id: "",
          number_of_cases: "",
          status: "ACTIVE",
          description: "",
        });
        setSelectedIncident(null);
      } else {
        alert("Failed to update incident");
      }
    } catch (error) {
      alert("Error updating incident");
    }
  };

  const renderIncidentCard = (incident) => (
    <div
      key={incident.id}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 space-y-3"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{incident.disease_name}</h3>
          <p className="text-sm text-gray-500">
            Facility: {incident.health_facility?.name}
          </p>
          <p className="text-sm text-gray-500">
            Cases: {incident.number_of_cases}
          </p>
        </div>
        <div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              incident.status === "ACTIVE"
                ? "bg-red-100 text-red-800"
                : incident.status === "RESOLVED"
                ? "bg-green-100 text-green-800"
                : incident.status === "CONTAINED"
                ? "bg-blue-100 text-blue-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {incident.status.replace("_", " ")}
          </span>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <button
          onClick={() => handleEditIncident(incident)}
          className="p-2 text-green-600 hover:text-green-800 rounded-lg hover:bg-green-50"
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleDelete(incident.id)}
          className="p-2 text-black hover:text-red-800 rounded-lg hover:bg-red-50"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  const handleEditIncident = (incident) => {
    setSelectedIncident(incident);
    setIncidentData({
      disease_name: incident.disease_name,
      health_facility_id: incident.health_facility.id,
      number_of_cases: incident.number_of_cases,
      status: incident.status,
      description: incident.description,
    });
    setShowUpdateModal(true);
  };


// New function to download incidents
const downloadIncidents = async (format) => {
    // If no incidents, return
    if (incidents.length === 0) {
      alert("No incidents to download");
      return;
    }

    try {
      // Prepare data for download
      const processedData = incidents.map(incident => ({
        "Disease Name": incident.disease_name,
        "Health Facility": incident.health_facility?.name,
        "Number of Cases": incident.number_of_cases,
        "Status": incident.status,
        "Reported By": incident.created_by?.phone_number,
        "Date": new Date(incident.created_at).toLocaleDateString()
      }));

      // Download based on selected format
      switch (format) {
        case 'csv':
          downloadCSV(processedData);
          break;
        case 'excel':
          downloadExcel(processedData);
          break;
        case 'pdf':
          downloadPDF(processedData);
          break;
        default:
          alert("Invalid download format");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download incidents");
    }
  };

  // CSV Download Helper
  const downloadCSV = (data) => {
    const headers = Object.keys(data[0]).join(",");
    const csvContent = [
      headers,
      ...data.map(row => Object.values(row).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "disease_incidents.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Excel Download Helper (using Blob and xlsx format)
  const downloadExcel = (data) => {
    import('xlsx').then((XLSX) => {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Disease Incidents");
      XLSX.writeFile(workbook, "disease_incidents.xlsx");
    }).catch(error => {
      console.error("Excel download error:", error);
      alert("Excel download requires 'xlsx' library. Please install it.");
    });
  };

  // PDF Download Helper
  const downloadPDF = (data) => {
    import('@react-pdf/renderer').then(({ PDFDownloadLink, Document, Page, Text, View, StyleSheet }) => {
      const styles = StyleSheet.create({
        page: { padding: 20 },
        header: { 
          fontSize: 16, 
          marginBottom: 10, 
          fontWeight: 'bold' 
        },
        row: { 
          fontSize: 10, 
          flexDirection: 'row', 
          borderBottom: '1 solid #000' 
        }
      });

      const PDFContent = () => (
        <Document>
          <Page size="A4" style={styles.page}>
            <Text style={styles.header}>Disease Incidents Report</Text>
            {data.map((incident, index) => (
              <View key={index} style={styles.row}>
                <Text>{incident['Disease Name']} - {incident['Health Facility']}</Text>
              </View>
            ))}
          </Page>
        </Document>
      );

      const link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([<PDFContent />], { type: 'application/pdf' }));
      link.download = "disease_incidents.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }).catch(error => {
      console.error("PDF download error:", error);
      alert("PDF download requires '@react-pdf/renderer' library. Please install it.");
    });
  };




  

  return (
    <div className="w-full px-12 ml-4">
    <h1 className="text-xl font-bold mb-4 text-blue-700 text-center">
      DISEASE INCIDENT MANAGEMENT
    </h1>

    <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
      <button
        onClick={() => setShowCreateModal(true)}
        className="px-4 py-2 bg-sky-900 text-white rounded-md flex items-center space-x-2 hover:bg-black"
      >
        <Plus className="h-4 w-4" />
        <span>Add Disease Incident</span>
      </button>

      <div className="relative">
            <button
              onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
              className="px-4 py-2 bg-green-400 text-white rounded-md flex items-center space-x-2 hover:bg-black"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
            {showDownloadDropdown && (
              <div className="absolute z-10 mt-2 w-48 bg-white border text-gray-400 rounded-md shadow-lg">
                <button 
                  onClick={() => {
                    downloadIncidents('csv');
                    setShowDownloadDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                >
                  <FileInput className="mr-2 h-4 w-4" /> CSV
                </button>
                <button 
                  onClick={() => {
                    downloadIncidents('excel');
                    setShowDownloadDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel
                </button>
                <button 
                  onClick={() => {
                    downloadIncidents('pdf');
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
          placeholder="Search by disease name or facility..."
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

    {!loading && paginatedIncidents.length > 0 && (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white rounded-lg">
          <thead className="bg-sky-900">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                #
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-white">
                Disease Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-white">
                Health Facility
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-white">
                Cases
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-white">
                Status
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-white">
                Reported By
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-white">
                Date
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-white">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedIncidents.map((incident, index) => (
              <tr
                key={incident.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100`}
              >
                <td className="px-4 py-2 text-sm text-gray-700">
                  {startIndex + index + 1}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {incident.disease_name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {incident.health_facility.name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {incident.number_of_cases}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {incident.status}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {incident.created_by.phone_number}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {new Date(incident.created_at).toLocaleDateString()}
                </td>
                <td>
                  <button
                    onClick={() => handleEditIncident(incident)}
                    className="p-2 text-green-600 hover:text-green-800 rounded-lg hover:bg-green-50"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(incident.id)}
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

    {!loading && paginatedIncidents.length === 0 && (
      <p className="text-center text-gray-500 my-4">
        No incidents found matching your search criteria.
      </p>
    )}

      {/* Pagination Controls */}
      <div className="flex justify-end items-end mt-4 mb-8">
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

        <div className="flex items-end space-x-4">
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

      {/* Create/Update Disease Incident Modal */}
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
                ? "Add New Disease Incident"
                : "Update Disease Incident"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={showCreateModal ? handleCreate : handleUpdate}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Disease Name
                </label>
                <input
                  type="text"
                  value={incidentData.disease_name}
                  onChange={(e) =>
                    setIncidentData({
                      ...incidentData,
                      disease_name: e.target.value,
                    })
                  }
                  className="mt-1 text-gray-400 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Health Facility
                </label>
                <select
                  value={incidentData.health_facility_id}
                  onChange={(e) =>
                    setIncidentData({
                      ...incidentData,
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
                  Number of Cases
                </label>
                <input
                  type="number"
                  min="0"
                  value={incidentData.number_of_cases}
                  onChange={(e) =>
                    setIncidentData({
                      ...incidentData,
                      number_of_cases: e.target.value,
                    })
                  }
                  className="mt-1 text-gray-400 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={incidentData.status}
                  onChange={(e) =>
                    setIncidentData({
                      ...incidentData,
                      status: e.target.value,
                    })
                  }
                  className="mt-1 text-gray-400 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  {statusOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={incidentData.description}
                  onChange={(e) =>
                    setIncidentData({
                      ...incidentData,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="mt-1 text-gray-400 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setShowUpdateModal(false);
                  setIncidentData({
                    disease_name: "",
                    health_facility_id: "",
                    number_of_cases: "",
                    status: "ACTIVE",
                    description: "",
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

export default Data_Entry_Clerk_ManageDiseases;
