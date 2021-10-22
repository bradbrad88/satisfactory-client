import React, { useState } from "react";
import { useLocation } from "react-router";
const useAdmin = () => {
  const { pathname } = useLocation();
  console.log("location", pathname);
  switch (pathname) {
    case "/admin/recipes":
      return { apiUrl: "" };

    case "/admin/buildings":
      return { apiUrl: "" };

    default:
      break;
  }
};

export default useAdmin;
