import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import NavBar from "../system/NavBar";
import Items from "./Items";
import Recipes from "./Recipes";
import useApi from "../../hooks/useApi";
import ItemInput from "./ItemInput";
import ItemList from "./ItemList.";
import EditItem from "./EditItem";
import "../../stylesheets/Main.css";

// Handle nav bar and routing,
// Handle authorization
const Admin = () => {
  return (
    <>
      {/* <NavBar /> */}
      <Route path={"/admin/items"} component={Items} />
      <Route path={"/admin/recipes"} component={Recipes} />
    </>
  );
};

export default Admin;
