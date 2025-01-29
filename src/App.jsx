// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";



// Imports
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout.jsx";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import VerifyPassword from "./components/auth/VerifyPassword.jsx";
import ResetPassword from "./components/auth/ResetPassword.jsx";
import ChangePassword from "./components/auth/ChangePassword.jsx";


// Admin imports
import Layout from "./components/admin/Layout.jsx";
import Users from "./components/pages/admin/Users.jsx";
import CreateUser from "./components/pages/admin/CreateNewUser.jsx";
import EditUsers from "./components/pages/admin/EditUsers.jsx";



import AdminProfile from "./components/pages/admin/AdminProfile.jsx";
import AdminManageFacilities from "./components/pages/admin/ManageFacilities.jsx";
import AdminManagePopulations from "./components/pages/admin/ManagePopulations.jsx";
import AdminManageDiseases from "./components/pages/admin/ManageDiseases.jsx";
import AdminManageHealthAccessibilities from "./components/pages/admin/ManageHealthAccessibilities.jsx";
import AdminManageResources from "./components/pages/admin/ManageResources.jsx";
import Data_Entry_Clerk_Layout from "./components/data_entry_clerk/Layout.jsx";
import Data_Entry_Home from "./components/pages/data_entry_clerk/Home.jsx";
import Data_Entry_Clerk_Profile from "./components/pages/data_entry_clerk/AdminProfile.jsx";
import Data_Entry_Clerk_ManageFacilities from "./components/pages/data_entry_clerk/ManageFacilities.jsx"
import Data_Entry_Clerk_ManagePopulations from "./components/pages/data_entry_clerk/ManagePopulations.jsx"
import Data_Entry_Clerk_ManageDiseases from "./components/pages/data_entry_clerk/ManageDiseases.jsx"
import Data_Entry_Clerk_ManageHealthAccessibilities from "./components/pages/data_entry_clerk/ManageHealthAccessibilities.jsx"
import Data_Entry_Clerk_ManageResources from "./components/pages/data_entry_clerk/ManageResources.jsx"
import AdminHome from "./components/pages/admin/Home.jsx";
import Data_analyst_layout from "./components/data_analyst/Layout.jsx";
import Data_Analyst_Home from "./components/pages/data_analyst/Home.jsx";
import Manage_Data from "./components/pages/data_analyst/Manage_Data.jsx";








const App = () => {
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in",
      delay: 100,
    });

    AOS.refresh();
  }, []);

  return (
    <div className="bg-white dark:bg-black dark:text-white text-black overflow-x-hidden">
      <BrowserRouter>
        <Routes>
          {/* Home view */}
          <Route path="/" element={<MainLayout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/verifypassword" element={<VerifyPassword />} />
          <Route path="/passwordreset" element={<ResetPassword />} />
          <Route path="/changePassword" element={<ChangePassword />} />

          {/* End Home view */}

          {/* Admin */}

          <Route path="/admin" element={<Layout />}>
            <Route index element={<AdminHome />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/edituser/:id" element={<EditUsers />} />
            <Route path="/admin/createUser/" element={<CreateUser />} />

            <Route path="/admin/facilities" element={<AdminManageFacilities />} />
            <Route path="/admin/populations" element={<AdminManagePopulations />} />
            <Route path="/admin/diseases" element={<AdminManageDiseases />} />
            <Route path="/admin/accessibilities" element={<AdminManageHealthAccessibilities />} />
            <Route path="/admin/allocations" element={<AdminManageResources />} />
            <Route path="/admin/profile/:id" element={<AdminProfile />} />

          </Route>


          {/* Data entry clerk */}

          <Route path="/data_entry_clerk" element={<Data_Entry_Clerk_Layout />}>
            <Route index element={<Data_Entry_Home />} />

            <Route path="/data_entry_clerk/facilities" element={<Data_Entry_Clerk_ManageFacilities />} />
            <Route path="/data_entry_clerk/populations" element={<Data_Entry_Clerk_ManagePopulations />} />
            <Route path="/data_entry_clerk/diseases" element={<Data_Entry_Clerk_ManageDiseases />} />
            <Route path="/data_entry_clerk/accessibilities" element={<Data_Entry_Clerk_ManageHealthAccessibilities />} />
            <Route path="/data_entry_clerk/allocations" element={<Data_Entry_Clerk_ManageResources />} />
            <Route path="/data_entry_clerk/profile/:id" element={<Data_Entry_Clerk_Profile />} />

          </Route>



          {/* Data Analyst */}

          <Route path="/data_analyst" element={<Data_analyst_layout />}>
            <Route index element={<Data_Analyst_Home />} />

            <Route path="/data_analyst/data" element={<Manage_Data />} />
            <Route path="/data_analyst/profile/:id" element={<Data_Entry_Clerk_Profile />} />

          </Route>





        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
