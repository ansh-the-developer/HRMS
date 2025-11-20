import React from "react";
import { Routes } from "react-router-dom";
import AuthRoutes from "./AuthRoutes";
import HomeRoutes from "./HomeRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Authentication-login related pages */}
      {AuthRoutes()}
      {/* Home-related pages */}
      {HomeRoutes()}
    </Routes>
  );
};

export default AppRoutes;
