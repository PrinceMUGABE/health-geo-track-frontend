/* eslint-disable no-unused-vars */
import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import MapComponent from "./MapComponent"; // Import the MapComponent you created

const FooterLinks = [
  {
    title: "Home",
    link: "/#home",
  },
  {
    title: "About",
    link: "/#about",
  },
  {
    title: "Services",
    link: "/#service",
  },
  {
    title: "Contact",
    link: "/#contact",
  },
];

const Footer = () => {
  return (
    <div className="bg-sky-900 text-white">
      <section id="footer" className="container py-8">
        <div className="flex flex-wrap justify-between items-start gap-8 py-5">
          {/* Company Details */}
          <div className="flex-1 min-w-[250px] py-8 px-4">
            <h1 className="sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3 flex items-center gap-3 text-white">
              Connect with Us
            </h1>
            <p className="mt-4 text-white">
              <a href="tel:+250783251199" className="flex items-center gap-2">
                <FaPhoneAlt size={20} /> +250 785 513 857
              </a>
            </p>
            <p className="mt-4 text-white">
              <a href="tel:+250788457408" className="flex items-center gap-2">
                <FaPhoneAlt size={20} /> +250 788 457 408
              </a>
            </p>
            <p className="mt-2 text-white">
              <a href="mailto:princemugabe568@gmail.com" className="flex items-center gap-2">
                <FaEnvelope size={20} /> info@moh.gov.rw
              </a>
            </p>
          </div>

          {/* Location Details */}
          <div className="flex-1 min-w-[250px] py-8 px-4">
            <h1 className="sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3 flex items-center gap-3 text-white">
              <FaMapMarkerAlt size={24} /> Our Location
            </h1>
            <p className="mt-4 text-white">
              <strong>Kigali, Rwanda</strong>
            </p>
            <p className="mt-2 text-white">
              <strong>Gasabo District </strong>
            </p>
            <p className="mt-2 text-white">
              <strong>Kacyiru Sector </strong>
            </p>
            <p className="mt-2 text-white">
              <strong>KG 774 st </strong>
            </p>
          </div>

          {/* Map Section */}
          <div className="flex-1 min-w-[250px] py-16 px-4">
            <h1 className="text-xl font-bold mb-4">Map</h1>
            <div className="overflow-hidden rounded-lg shadow-lg">
              <MapComponent />
            </div>
          </div>
        </div>
      </section>

      {/* Copyright Section */}
      <div className="bg-white py-2 text-center text-white">
        <p className="text-sky-900">&copy; {new Date().getFullYear()} MOH. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
