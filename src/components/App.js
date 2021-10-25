import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./system/Header";
import Admin from "./admin/Admin";
import "../stylesheets/Main.css";

const App = () => {
  return (
    <Router>
      <Header />
      <Route path={"/admin"} component={Admin} />
    </Router>
  );
};

export default App;
