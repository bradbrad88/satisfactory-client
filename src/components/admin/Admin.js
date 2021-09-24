import React from "react";
import { Route } from "react-router-dom";

import Items from "./Items";
import Recipes from "./Recipes";
import "../../stylesheets/Main.css";

// Handle nav bar and routing,
// Handle authorization
const Admin = () => {
  return (
    <>
      <Route path={"/admin/items"} component={Items} />
      <Route path={"/admin/recipes"} component={Recipes} />
    </>
  );
};

export default Admin;
