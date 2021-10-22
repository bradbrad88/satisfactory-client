import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./system/Header";
import Admin from "./admin/Admin";
import { AdminProvider } from "../contexts/adminContext";
import "../stylesheets/Main.css";

const App = () => {
  return (
    <Router>
      <AdminProvider>
        <Header />
        <Route path={"/admin"} component={Admin} />
      </AdminProvider>
    </Router>
  );
};

export default App;
