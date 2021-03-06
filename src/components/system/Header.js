import React, { useContext, useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { SearchContext } from "contexts/SearchContext";
import useAdminSetup from "hooks/useAdminSetup";
import NavBar from "./NavBar";
import { hamburgerMenu as menuIcon } from "../../utils/SvgIcons";

const Header = () => {
  const [active, setActive] = useState(false);
  const location = useLocation();
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1224px)" });
  const { sections } = useAdminSetup();
  const { searchTerm, setSearchTerm } = useContext(SearchContext);

  const navItems = () => {
    const pathArray = location.pathname.split("/").filter(str => str !== "");
    switch (pathArray[0]) {
      case undefined:
        return [{ path: "/admin", section: "Admin" }];
      case "admin":
        return sections;
      default:
        return [];
    }
  };

  const handleClick = () => {
    setActive(!active);
  };

  const handleSelection = () => {
    setActive(false);
  };

  return (
    isDesktopOrLaptop && (
      <div className={"main-header-container"}>
        <div className={"main-header"}>
          <button onClick={handleClick}>{menuIcon(48)}</button>
          <Link className={"title"} to={"/"}>
            Satisfactory Planner
          </Link>
          <input
            className={"search"}
            onChange={e => setSearchTerm(e.target.value)}
            value={searchTerm}
            placeholder={"Search..."}
          />
          {/* <p>{debouncedSearchTerm}</p> */}
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
