import React from "react";
import { Route } from "react-router-dom";
import { adminSetup } from "./adminSetup";
import "../../stylesheets/Main.css";

import AdminDashboard from "./AdminDashboard";
// Handle nav bar and routing,
// Handle authorization
// Gather item list data

const Admin = () => {
  const renderRoutes = () => {
    return adminSetup.map(route => (
      <Route path={route.path} component={route.component} key={route.title} />
    ));
  };

  return (
    <>
      {renderRoutes()}
      <Route path={"/admin"} exact component={AdminDashboard} />
    </>
  );
};

export default Admin;
