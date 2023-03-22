/** @format */

import React from "react";
import { NavLink } from "react-router-dom";

const listMenus = [
  {
    name: "Dashboard",
    to: "/",
  },
  {
    name: "Kriteria",
    to: "kriteria",
  },
  {
    name: "Alternatif",
    to: "alternatif",
  },
  {
    name: "Nilai",
    to: "nilai",
  },
  {
    name: "Perhitungan",
    to: "perhitungan",
  },
];

const Menu = () => {
  return (
    <ul className="menu bg-base-100 w-56 p-2 rounded-box">
      {listMenus.map((row, index) => (
        <li key={index}>
          <NavLink to={row.to}>{row.name}</NavLink>
        </li>
      ))}
    </ul>
  );
};

export default Menu;
