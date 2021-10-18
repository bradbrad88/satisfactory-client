import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../stylesheets/NavBar.css";
import { hamburgerMenu as menuIcon } from "../../utils/SvgIcons";

const NavBar = ({ navItems, active, handleSelection }) => {
  const renderNavItems = () => {
    return navItems.map(nav => (
      <Link
        to={nav.path}
        className={"nav-item"}
        onClick={handleSelection}
        key={nav.title}
      >
        {nav.title}
      </Link>
    ));
  };

  return (
    <div className={`nav-bar ${active && "active"}`}>
      {/* <button onClick={() => setActive(!active)}>{menuIcon}</button> */}
      {renderNavItems()}
    </div>
  );
};

export default NavBar;
