import React, { useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import NavBar from "./NavBar";
import { hamburgerMenu as menuIcon } from "../../utils/SvgIcons";

const Header = () => {
  const [active, setActive] = useState(false);

  const location = useLocation();
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1224px)" });
  console.log(
    "location",
    location.pathname.split("/").filter(str => str !== "")
  );
  const navItems = () => {
    const pathArray = location.pathname.split("/").filter(str => str !== "");
    console.log("path array", pathArray[0]);
    switch (pathArray[0]) {
      case undefined:
        return [{ to: "/admin", title: "Admin" }];
      case "admin":
        return [
          { to: "/admin/items", title: "Items" },
          { to: "/admin/recipes", title: "Recipes" },
        ];
      default:
        return [];
        break;
    }
  };

  const handleClick = () => {
    setActive(!active);
  };

  const handleSelection = () => {
    // setActive(false);
  };

  return (
    isDesktopOrLaptop && (
      <div className={"main-header-container"}>
        <div className={"main-header"}>
          <button onClick={handleClick}>{menuIcon(48)}</button>
          <Link className={"title"} to={"/"}>
            Satisfactory Planner
          </Link>
          <NavBar
            navItems={navItems()}
            active={active}
            handleSelection={handleSelection}
          />
        </div>
      </div>
    )
  );
};

export default Header;
