/** @format */

import React from "react";
import { Route, Routes } from "react-router-dom";
import Alternatif from "../pages/alternatif/Alternatif";
import Dashboard from "../pages/dashboard/Dashboard";
import Kriteria from "../pages/kriteria/Kriteria";
import Perhitungan from "../pages/perhitungan/Perhitungan";

const MyRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="kriteria" element={<Kriteria />} />
      <Route path="alternatif" element={<Alternatif />} />
      <Route path="perhitungan" element={<Perhitungan />} />
    </Routes>
  );
};

export default MyRoutes;
