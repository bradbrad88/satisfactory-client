import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import SearchProvider from "contexts/SearchContext";
import Header from "./system/Header";
import Admin from "./admin/Admin";
import "../stylesheets/Main.css";
import FactoryBuilder from "./factory-builder/FactoryBuilder";
import FactoryManagerProvider from "contexts/FactoryManagerContext";

const App = () => {
  return (
    <SearchProvider>
      <Router>
        <Header />
        <Route path={"/admin"} component={Admin} />
        <FactoryManagerProvider>
          <Route path={"/"} exact component={FactoryBuilder} />
        </FactoryManagerProvider>
      </Router>
    </SearchProvider>
  );
};

export default App;
