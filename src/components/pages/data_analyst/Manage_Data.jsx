import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Building2, PieChart } from "lucide-react";

import {
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Chart as ChartJS, registerables } from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import RwandaMap from "./MapComponent";

ChartJS.register(
  ...registerables,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const BASE_URL = "http://127.0.0.1:8000";

function Manage_Data() {
  const navigate = useNavigate();

  // State Management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [populations, setPopulations] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [accessibilities, setAccessibilities] = useState([]);

  // Chart Configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      tooltip: { enabled: true },
    },
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: { beginAtZero: true },
      x: { grid: { display: false } },
    },
  };

  const areaChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        stacked: true,
      },
      x: { grid: { display: false } },
    },
    plugins: {
      filler: { propagate: true },
    },
  };

  const doughnutOptions = {
    ...chartOptions,
    cutout: "70%",
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  // Fetch Functions
  const fetchAllocations = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/resource_allocation/allocations/`,
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
    }
  };

  const fetchFacilities = async () => {
    try {
      const response = await fetch(`${BASE_URL}/facility/facilities/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFacilities(data);
      }
    } catch (error) {
      console.error("Error fetching facilities:", error);
    }
  };

  const fetchPopulations = async () => {
    try {
      const response = await fetch(`${BASE_URL}/population/populations/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPopulations(data);
      } else {
        setError("Failed to fetch population data");
      }
    } catch (err) {
      setError("Error fetching population data");
    }
  };

  const fetchIncidents = async () => {
    try {
      const response = await fetch(`${BASE_URL}/incident/incidents/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIncidents(data);
      } else {
        setError("Failed to fetch incidents");
      }
    } catch (err) {
      setError("Error fetching incidents");
    }
  };

  const fetchAccessibilities = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/accessibility/accessibilities/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAccessibilities(data);
      } else {
        setError("Failed to fetch accessibility data");
      }
    } catch (err) {
      setError("Error fetching accessibility data");
    }
  };

  // Chart Data Preparation Functions
  const prepareFacilityTypeAreaData = () => {
    const typeCounts = facilities.reduce((acc, facility) => {
      acc[facility.facility_type] = (acc[facility.facility_type] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(typeCounts),
      datasets: [
        {
          label: "Facility Types",
          data: Object.values(typeCounts),
          fill: true,
          borderColor: COLORS[0],
          backgroundColor: `${COLORS[0]}40`,
          tension: 0.4,
        },
      ],
    };
  };

  const prepareFacilityStatusAreaData = () => {
    const statusCounts = facilities.reduce((acc, facility) => {
      acc[facility.status] = (acc[facility.status] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: "Facility Status",
          data: Object.values(statusCounts),
          backgroundColor: COLORS[1] + "80",
          borderColor: COLORS[1],
        },
      ],
    };
  };

  const preparePopulationAgeColumnData = () => {
    const ageGroups = populations.reduce(
      (acc, pop) => ({
        children: acc.children + parseInt(pop.children_under_5),
        youth: acc.youth + parseInt(pop.youth_population),
        adults: acc.adults + parseInt(pop.adult_population),
        elderly: acc.elderly + parseInt(pop.elderly_population),
      }),
      { children: 0, youth: 0, adults: 0, elderly: 0 }
    );

    return {
      labels: ["Children (0-5)", "Youth", "Adults", "Elderly"],
      datasets: [
        {
          label: "Population Age Distribution",
          data: [
            ageGroups.children,
            ageGroups.youth,
            ageGroups.adults,
            ageGroups.elderly,
          ],
          backgroundColor: COLORS.slice(0, 4),
        },
      ],
    };
  };

  const resourceAllocationData = () => {
    const durationDistribution = [
      {
        name: "0-15 Days",
        value: allocations.filter((a) => a.duration_in_days <= 15).length,
      },
      {
        name: "16-30 Days",
        value: allocations.filter(
          (a) => a.duration_in_days > 15 && a.duration_in_days <= 30
        ).length,
      },
      {
        name: "31-60 Days",
        value: allocations.filter(
          (a) => a.duration_in_days > 30 && a.duration_in_days <= 60
        ).length,
      },
      {
        name: "60+ Days",
        value: allocations.filter((a) => a.duration_in_days > 60).length,
      },
    ];

    return {
      labels: durationDistribution.map((item) => item.name),
      datasets: [
        {
          data: durationDistribution.map((item) => item.value),
          backgroundColor: COLORS,
        },
      ],
    };
  };

  // Components
  const SummaryCard = ({ title, value, icon: Icon, bgColor }) => (
    <div className={`${bgColor} rounded-lg shadow-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white text-sm">{title}</p>
          <h3 className="text-white text-2xl font-bold">{value}</h3>
        </div>
        <Icon className="h-12 w-12 text-white opacity-75" />
      </div>
    </div>
  );

  const ChartSection = ({ title, total, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md h-64">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-black">{title}</h3>
        <span className="text-sm text-gray-600">Total: {total}</span>
      </div>
      <div className="h-48">{children}</div>
    </div>
  );

  // useEffect
  useEffect(() => {
    const fetchAllData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        await Promise.all([
          fetchAllocations(),
          fetchFacilities(),
          fetchPopulations(),
          fetchIncidents(),
          fetchAccessibilities(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="mt-20 p-6 flex items-center justify-center">
        <div className="text-lg font-semibold text-gray-600">
          Loading dashboard data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-20 p-6 flex items-center justify-center">
        <div className="text-lg font-semibold text-red-600">Error: {error}</div>
      </div>
    );
  }

  const prepareIncidentStatusData = () => {
    const statusCounts = incidents.reduce((acc, incident) => {
      acc[incident.status] = (acc[incident.status] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: "Incident Status Distribution",
          data: Object.values(statusCounts),
          backgroundColor: COLORS.slice(0, Object.keys(statusCounts).length),
        },
      ],
    };
  };

  // Modified incident trend data preparation
  const prepareIncidentTrendData = () => {
    // Define status colors
    const statusColors = {
      ACTIVE: "#FF8042",
      RESOLVED: "#00C49F",
      UNDER_INVESTIGATION: "#FFBB28",
      CONTAINED: "#0088FE",
    };

    // Group incidents by date and status
    const incidentsByDateAndStatus = incidents.reduce((acc, incident) => {
      const date = new Date(incident.created_at).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = {
          ACTIVE: 0,
          RESOLVED: 0,
          UNDER_INVESTIGATION: 0,
          CONTAINED: 0,
        };
      }
      acc[date][incident.status]++;
      return acc;
    }, {});

    // Sort dates
    const sortedDates = Object.keys(incidentsByDateAndStatus).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    // Create datasets for each status
    const datasets = Object.keys(statusColors).map((status) => ({
      label: status.replace(/_/g, " "),
      data: sortedDates.map((date) => incidentsByDateAndStatus[date][status]),
      fill: true,
      backgroundColor: `${statusColors[status]}80`,
      borderColor: statusColors[status],
      tension: 0.4,
    }));

    return {
      labels: sortedDates,
      datasets: datasets,
    };
  };

  // Modified area chart options for stacked view
  const stackedAreaOptions = {
    ...chartOptions,
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  // Add horizontal bar chart options
  const horizontalBarOptions = {
    ...chartOptions,
    indexAxis: "y",
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="ml-4 p-6 space-y-6 justify-center">
      <h1 className="text-blue-950 font-extrabold text-center text-4xl mb-8">
        Healthcare Analytics Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Facilities"
          value={facilities.length}
          icon={Building2}
          bgColor="bg-gradient-to-r from-green-500 to-green-600"
        />
        <SummaryCard
          title="Total Incidents"
          value={incidents.length}
          icon={Activity}
          bgColor="bg-gradient-to-r from-red-500 to-red-600"
        />
        <SummaryCard
          title="Resource Allocations"
          value={allocations.length}
          icon={PieChart}
          bgColor="bg-gradient-to-r from-purple-500 to-purple-600"
        />
      </div>

      {/* Analytics Sections - Modified to include incident charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Incident Trend Over Time */}
        {/* Updated Incident Trend Over Time */}
        <ChartSection
          title="Incident Trends by Status"
          total={incidents.length}
        >
          <Line
            data={prepareIncidentTrendData()}
            options={stackedAreaOptions}
          />
        </ChartSection>

        {/* Incident Status Distribution */}
        <ChartSection title="Incidents by Status" total={incidents.length}>
          <Bar
            data={prepareIncidentStatusData()}
            options={horizontalBarOptions}
          />
        </ChartSection>

        {/* Facility Types */}
        <ChartSection title="Facility Types" total={facilities.length}>
          <Line
            data={prepareFacilityTypeAreaData()}
            options={{
              ...lineChartOptions,
              plugins: {
                ...lineChartOptions.plugins,
                filler: {
                  propagate: true,
                },
              },
            }}
          />
        </ChartSection>

        {/* Facility Status */}
        <ChartSection title="Facility Status" total={facilities.length}>
          <Line
            data={prepareFacilityStatusAreaData()}
            options={areaChartOptions}
          />
        </ChartSection>

        {/* Population Age Distribution */}
        <ChartSection
          title="Population Age Groups"
          total={populations.reduce(
            (sum, pop) => sum + parseInt(pop.total_population),
            0
          )}
        >
          <Bar data={preparePopulationAgeColumnData()} options={chartOptions} />
        </ChartSection>

        {/* Resource Allocation Distribution */}
        <ChartSection
          title="Resource Allocation Durations"
          total={allocations.length}
        >
          <Pie data={resourceAllocationData()} options={doughnutOptions} />
        </ChartSection>
      </div>

      <div className="overflow-hidden rounded-lg shadow-lg">
        <RwandaMap />
      </div>
    </div>
  );
}

export default Manage_Data;
