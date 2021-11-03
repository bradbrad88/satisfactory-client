import React from "react";
import { Route } from "react-router-dom";
// import { adminSetup } from "./adminSetup";
import EditScreen from "./EditScreen";
import "../../stylesheets/Main.css";

import AdminDashboard from "./AdminDashboard";
// Handle nav bar and routing,
// Handle authorization
// Gather item list data

const Admin = () => {
  return (
    <>
      <Route path={"/admin/:section"} component={EditScreen} />
      <Route path={"/admin"} exact component={AdminDashboard} />
    </>
  );
};

export default Admin;
