import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./system/Header";
import Admin from "./admin/Admin";
import Items from "./admin/Items";
import "../stylesheets/Main.css";

const App = () => {
  return (
    <Router>
      <Header />
      <Route path={"/admin"} component={Admin} />
      {/* <Route path={"/admin/item"} component={Items} /> */}
    </Router>
  );
};

export default App;
