import React from "react";
import { Route } from "react-router-dom";
import HomePage from "../features/home/homePage";
const HomeRoutes = () => (
  <>
    <Route path="/" element={<HomePage />} />
  </>
);

export default HomeRoutes;
