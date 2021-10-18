import React from "react";
import { Route } from "react-router-dom";

import Items from "./Items";
import Recipes from "./Recipes";
import Buildings from "./Buildings";
import "../../stylesheets/Main.css";
import { adminSetup } from "./adminSetup";
import AdminDashboard from "./AdminDashboard";
// Handle nav bar and routing,
// Handle authorization
console.log("admin setup", adminSetup);
const Admin = () => {
  const renderRoutes = () => {
    return adminSetup.map(section => (
      <Route path={section.path} component={section.component} />
    ));
  };
  return (
    <>
      <Route path={"/admin"} exact component={AdminDashboard} />
      {renderRoutes()}
      {/* <Route path={"/admin/items"} component={Items} />
      <Route path={"/admin/recipes"} component={Recipes} />
      <Route path={"/admin/buildings"} component={Buildings} /> */}
    </>
  );
};

export default Admin;
