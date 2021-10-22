import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useLocation } from "react-router";
import Items from "./Items";
import Recipes from "./Recipes";
import Buildings from "./Buildings";
import "../../stylesheets/Main.css";
import { adminSetup } from "./adminSetup";
import AdminDashboard from "./AdminDashboard";
import EditScreen from "./EditScreen";
import EditList from "./EditList";
import EditItem from "./EditItem";
import EditRecipe from "./EditRecipe";
import EditBuilding from "./EditBuilding";
import useAdmin from "../../hooks/useAdmin";
// Handle nav bar and routing,
// Handle authorization
// Gather item list data

console.log("admin setup", adminSetup);
const Admin = () => {
  const location = useLocation();
  const [listData, setListData] = useState([]);
  const admin = useAdmin();
  useEffect(() => {});
  const renderRoutes = () => {
    return adminSetup.map(section => (
      <Route path={section.path} component={section.component} />
    ));
  };
  return (
    <>
      <Route path={"/admin"} exact component={AdminDashboard} />
      {/* {renderRoutes()} */}
      {/* <EditList items={listData} /> */}

      <Switch>
        <Route path={"/admin/items"}>
          <EditItem editMode={false} />
          <EditList listType={"items"} />
        </Route>
        <Route path={"/admin/recipes"}>
          <EditRecipe editMode={false} />
          <EditList listType={"recipes"} />
        </Route>
        <Route path={"/admin/buildings"}>
          <EditBuilding editMode={false} />
          <EditList listType={"buildings"} />
        </Route>
      </Switch>
    </>
  );
};

export default Admin;
