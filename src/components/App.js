import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./system/Header";
import Admin from "./admin/Admin";
import "../stylesheets/Main.css";
import FactoryBuilder from "./factory-builder/FactoryBuilder";

const App = () => {
  return (
    <Router>
      <Header />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/"} exact component={FactoryBuilder} />
    </Router>
  );
};

export default App;
