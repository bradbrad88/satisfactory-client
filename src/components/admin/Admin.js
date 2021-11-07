import React from "react";
import { Route } from "react-router-dom";
import EditScreen from "./EditScreen";
import "../../stylesheets/Main.css";

import AdminDashboard from "./AdminDashboard";

const Admin = () => {
  return (
    <>
      <Route path={"/admin/:section"} component={EditScreen} />
      <Route path={"/admin"} exact component={AdminDashboard} />
    </>
  );
};

export default Admin;
