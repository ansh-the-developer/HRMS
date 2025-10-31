import React from "react";
import { Routes } from "react-router-dom";
import AuthRoutes from "./AuthRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {AuthRoutes()}
    </Routes>
  );
};

export default AppRoutes;
