import React, { useState, useEffect, useRef } from "react";
import {
  Eye,
  Trash2,
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
} from "../../ui/Dialog";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Data_Entry_Clerk_ManagePopulations = () => {
  const [populations, setPopulations] = useState([]);
  const [selectedPopulation, setSelectedPopulation] = useState(null);
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

  const [populationData, setPopulationData] = useState({
    district: "",
    sector: "",
    total_population: "",
    male_population: "",
    female_population: "",
    children_under_5: "",
    youth_population: "",
    adult_population: "",
    elderly_population: "",
    population_density: "",
    socioeconomic_status: "LOW",
    unemployment_rate: "",
    literacy_rate: "",
  });

  const socioeconomicOptions = [
    ["LOW", "Low Income"],
    ["MIDDLE", "Middle Income"],
    ["HIGH", "High Income"],
  ];

  useEffect(() => {
    fetchPopulations();
  }, []);

  const rowsOptions = [5, 10, 30, 50, 100];

  const filteredPopulations = populations.filter(
    (pop) =>
      pop.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pop.sector?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPopulations.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedPopulations = filteredPopulations.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const fetchPopulations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8000/population/populations/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPopulations(data);
      } else {
        setError("Failed to fetch population data");
      }
    } catch (err) {
      setError("Error fetching population data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this population data?")
    ) {
      try {
        const response = await fetch(
          `http://localhost:8000/population/delete/${id}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          setPopulations((prev) =>
            prev.filter((population) => population.id !== id)
          );
        } else {
          alert("Failed to delete population data");
        }
      } catch (error) {
        alert("Error deleting population data");
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    // Check for duplicates in the local state
    const duplicate = populations.find(
      (p) => p.district === populationData.district && p.sector === populationData.sector
    );
  
    if (duplicate) {
      alert("Population data for this district and sector already exists.");
      return;
    }
  
    // Calculate total population
    const calculatedTotalPopulation =
      parseInt(populationData.male_population || 0) +
      parseInt(populationData.female_population || 0);
  
    const payload = {
      ...populationData,
      total_population: calculatedTotalPopulation,
    };
  
    try {
      const response = await fetch("http://localhost:8000/population/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const newPopulation = await response.json();
        setPopulations([...populations, newPopulation]);
        setShowCreateModal(false);
        setPopulationData({
          district: "",
          sector: "",
          total_population: "",
          male_population: "",
          female_population: "",
          children_under_5: "",
          youth_population: "",
          adult_population: "",
          elderly_population: "",
          population_density: "",
          socioeconomic_status: "LOW",
          unemployment_rate: "",
          literacy_rate: "",
        });
      } else {
        alert("Failed to create population record");
      }
    } catch (error) {
      alert("Error creating population record");
    }
  };
  

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/population/update/${selectedPopulation.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(populationData),
        }
      );

      if (response.ok) {
        const updatedPopulation = await response.json();
        setPopulations(
          populations.map((pop) =>
            pop.id === selectedPopulation.id ? updatedPopulation : pop
          )
        );
        setShowUpdateModal(false);
        setPopulationData({
          district: "",
          sector: "",
          total_population: "",
          male_population: "",
          female_population: "",
          children_under_5: "",
          youth_population: "",
          adult_population: "",
          elderly_population: "",
          population_density: "",
          socioeconomic_status: "LOW",
          unemployment_rate: "",
          literacy_rate: "",
        });
        setSelectedPopulation(null);
      } else {
        alert("Failed to update population record");
      }
    } catch (error) {
      alert("Error updating population record");
    }
  };

  const renderPopulationCard = (population) => (
    <div
      key={population.id}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 space-y-3"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">
            {population.district} - {population.sector}
          </h3>
          <p className="text-sm text-gray-500">
            Total Population: {population.total_population.toLocaleString()}
          </p>
        </div>
        <div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              population.socioeconomic_status === "HIGH"
                ? "bg-green-100 text-green-800"
                : population.socioeconomic_status === "MIDDLE"
                ? "bg-blue-100 text-blue-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {population.socioeconomic_status.replace("_", " ")}
          </span>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <button
          onClick={() => handleViewDetails(population)}
          className="p-2 text-blue-400 hover:text-white rounded-lg hover:bg-black"
        >
          <Eye className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleEditPopulation(population)}
          className="p-2 text-green-400 hover:text-white rounded-lg hover:bg-black"
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleDelete(population.id)}
          className="p-2 text-black hover:text-red-800 rounded-lg hover:bg-red-50"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  const handleViewDetails = (population) => {
    setSelectedPopulation(population);
    setShowModal(true);
  };

  const handleEditPopulation = (population) => {
    setSelectedPopulation(population);
    setPopulationData({
      district: population.district,
      sector: population.sector,
      total_population: population.total_population,
      male_population: population.male_population,
      female_population: population.female_population,
      children_under_5: population.children_under_5,
      youth_population: population.youth_population,
      adult_population: population.adult_population,
      elderly_population: population.elderly_population,
      population_density: population.population_density,
      socioeconomic_status: population.socioeconomic_status,
      unemployment_rate: population.unemployment_rate,
      literacy_rate: population.literacy_rate,
    });
    setShowUpdateModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="w-full px-12 ml-4">
      <h1 className="text-xl font-bold mb-4 text-blue-700 text-center">
        POPULATION DATA MANAGEMENT
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-sky-900 text-white rounded-md flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Population Data</span>
        </button>

        <div className="relative w-full md:w-auto">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by district or sector..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-auto pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

       {/* Display populations in a table */}
       {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && populations.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg">
            <thead className="bg-sky-900">
              <tr>
                <th className="p-3 text-left">District</th>
                <th className="p-3 text-left">Sector</th>
                <th className="p-3 text-right">Total Population</th>
                <th className="p-3 text-left">Socioeconomic Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPopulations.map((population) => (
                <tr 
                  key={population.id} 
                  className="border-b hover:bg-blue-50 transition-colors text-gray-700"
                >
                  <td className="p-3">{population.district}</td>
                  <td className="p-3">{population.sector}</td>
                  <td className="p-3 text-right">
                    {population.total_population.toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        population.socioeconomic_status === "HIGH"
                          ? "bg-green-100 text-green-800"
                          : population.socioeconomic_status === "MIDDLE"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {population.socioeconomic_status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(population)}
                        className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditPopulation(population)}
                        className="p-2 text-green-600 hover:text-green-800 rounded-lg hover:bg-green-50"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(population.id)}
                        className="p-2 text-black hover:text-red-800 rounded-lg hover:bg-red-50"
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
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
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

      {/* View Details Modal with Charts */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle className="text-black text-center mb-8">
              Population Details
            </DialogTitle>
          </DialogHeader>

          {selectedPopulation && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-black">Location</h4>
                  <p className="text-black">
                    District: <span className="text-gray-400"></span>
                    {selectedPopulation.district}
                  </p>
                  <p className="text-black">
                    Sector: <span className="text-gray-400"></span>
                    {selectedPopulation.sector}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-black">Total Population</h4>
                  <p className="text-gray-400">
                    {selectedPopulation.total_population.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Demographics Charts */}
              <div className="grid grid-cols-2 gap-4">
                <div className="h-64">
                  <h4 className="font-medium mb-2 text-black">
                    Gender Distribution
                  </h4>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Male",
                            value: selectedPopulation.male_population,
                          },
                          {
                            name: "Female",
                            value: selectedPopulation.female_population,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        <Cell fill="#3b82f6" />
                        <Cell fill="#ec4899" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-64">
                  <h4 className="font-medium mb-2 text-black">
                    Age Distribution
                  </h4>
                  <ResponsiveContainer>
                    <BarChart
                      data={[
                        {
                          name: "Under 5",
                          value: selectedPopulation.children_under_5,
                        },
                        {
                          name: "Youth",
                          value: selectedPopulation.youth_population,
                        },
                        {
                          name: "Adult",
                          value: selectedPopulation.adult_population,
                        },
                        {
                          name: "Elderly",
                          value: selectedPopulation.elderly_population,
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Previous code remains the same until the Additional Statistics section */}

              {/* Additional Statistics */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-blue-50 p-4 rounded-lg mt-16">
                  <h4 className="font-medium text-black">Population Density</h4>
                  <p className="text-gray-400">
                    {selectedPopulation.population_density} per km²
                  </p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg mt-16">
                  <h4 className="font-medium text-black">Literacy Rate</h4>
                  <p className="text-gray-400">
                    {selectedPopulation.literacy_rate}%
                  </p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg mt-16">
                  <h4 className="font-medium text-black">Unemployment Rate</h4>
                  <p className="text-gray-400">
                    {selectedPopulation.unemployment_rate}%
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-100 bg-blue-700 rounded-md hover:bg-green-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Update Population Modal */}
      <Dialog
        open={showCreateModal || showUpdateModal}
        onOpenChange={() => {
          setShowCreateModal(false);
          setShowUpdateModal(false);
        }}
      >
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle className="text-center text-black font-bold">
              {showCreateModal
                ? "Add New Population Data"
                : "Update Population Data"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={showCreateModal ? handleCreate : handleUpdate}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  District
                </label>
                <input
                  type="text"
                  value={populationData.district}
                  onChange={(e) =>
                    setPopulationData({
                      ...populationData,
                      district: e.target.value,
                    })
                  }
                  className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sector
                </label>
                <input
                  type="text"
                  value={populationData.sector}
                  onChange={(e) =>
                    setPopulationData({
                      ...populationData,
                      sector: e.target.value,
                    })
                  }
                  className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Male Population
                </label>
                <input
                  type="number"
                  value={populationData.male_population}
                  onChange={(e) =>
                    setPopulationData({
                      ...populationData,
                      male_population: e.target.value,
                    })
                  }
                  className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Female Population
                </label>
                <input
                  type="number"
                  value={populationData.female_population}
                  onChange={(e) =>
                    setPopulationData({
                      ...populationData,
                      female_population: e.target.value,
                    })
                  }
                  className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Children Under 5
                </label>
                <input
                  type="number"
                  value={populationData.children_under_5}
                  onChange={(e) =>
                    setPopulationData({
                      ...populationData,
                      children_under_5: e.target.value,
                    })
                  }
                  className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Youth Population
                </label>
                <input
                  type="number"
                  value={populationData.youth_population}
                  onChange={(e) =>
                    setPopulationData({
                      ...populationData,
                      youth_population: e.target.value,
                    })
                  }
                  className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Adult Population
                </label>
                <input
                  type="number"
                  value={populationData.adult_population}
                  onChange={(e) =>
                    setPopulationData({
                      ...populationData,
                      adult_population: e.target.value,
                    })
                  }
                  className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Elderly Population
                </label>
                <input
                  type="number"
                  value={populationData.elderly_population}
                  onChange={(e) =>
                    setPopulationData({
                      ...populationData,
                      elderly_population: e.target.value,
                    })
                  }
                  className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Population Density
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={populationData.population_density}
                  onChange={(e) =>
                    setPopulationData({
                      ...populationData,
                      population_density: e.target.value,
                    })
                  }
                  className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Socioeconomic Status
                </label>
                <select
                  value={populationData.socioeconomic_status}
                  onChange={(e) =>
                    setPopulationData({
                      ...populationData,
                      socioeconomic_status: e.target.value,
                    })
                  }
                  className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  {socioeconomicOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unemployment Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={populationData.unemployment_rate}
                  onChange={(e) =>
                    setPopulationData({
                      ...populationData,
                      unemployment_rate: e.target.value,
                    })
                  }
                  className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Literacy Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={populationData.literacy_rate}
                  onChange={(e) =>
                    setPopulationData({
                      ...populationData,
                      literacy_rate: e.target.value,
                    })
                  }
                  className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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

export default Data_Entry_Clerk_ManagePopulations;
