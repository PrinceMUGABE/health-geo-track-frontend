import React, { useState } from "react";
import {
  FaUsers,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { GiHealthNormal } from "react-icons/gi";
import { FiActivity } from "react-icons/fi";
import { BiAccessibility } from "react-icons/bi";
import { AiFillDatabase } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import loginImage from "../../assets/pictures/system/logo.jpg";
import { Outlet } from 'react-router-dom';

function Data_analyst_layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const userId = userData.id || "";

  const navLinks = [
    { id: 1, name: "Dashboard", path: "/data_analyst/data", icon: <MdDashboard /> },
    // { id: 2, name: "Data", path: "/data_analyst/data", icon: <GiHealthNormal /> },
    { id: 2, name: "Profile", path: `/data_analyst/${userId}`, icon: <FaUserCircle /> },
  ];

  const handleLinkClick = (index, path) => {
    setActiveLink(index);
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation */}
      <nav className="bg-sky-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-[2000px] mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src={loginImage}
                alt="Logo"
                className="h-10 w-10 rounded-full cursor-pointer"
                onClick={() => navigate("/")}
              />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 text-white"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {navLinks.map((link, index) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(index, link.path)}
                  className={`px-4 py-2 text-white hover:bg-gray-700 rounded-md flex items-center space-x-2 ${
                    activeLink === index ? "bg-black" : ""
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white hover:bg-blue-700 rounded-md flex items-center space-x-2"
              >
                <FaSignOutAlt className="text-xl" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-green-700 shadow-lg">
            <div className="flex flex-col pt-4 space-y-1">
              {navLinks.map((link, index) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(index, link.path)}
                  className={`px-6 py-3 text-sm font-medium text-white hover:bg-green-600 text-left flex items-center space-x-2 ${
                    activeLink === index ? "bg-green-600" : ""
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="px-6 py-3 text-sm font-medium text-white hover:bg-green-600 text-left flex items-center space-x-2"
              >
                <FaSignOutAlt className="text-lg" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-[2000px] mx-auto px-4 py-6 overflow-y-auto">
        <main className="w-full bg-white rounded-lg shadow-md">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


export default Data_analyst_layout;
