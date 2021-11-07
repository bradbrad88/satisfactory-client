import React from "react";
import { useHistory } from "react-router";
import useAdminSetup from "hooks/useAdminSetup";
// import { adminSetup } from "./adminSetup";

const AdminDashboard = () => {
  const history = useHistory();
  const { sections } = useAdminSetup();
  const handleClick = path => {
    history.push(path);
  };

  const renderButtons = () => {
    return sections.map(section => (
      <button
        key={section.section}
        className={"admin-sections"}
        onClick={() => handleClick(section.path)}
      >
        {section.icon}
        <h3>{section.section.toUpperCase()}</h3>
      </button>
    ));
  };
  return <div className={"admin-dashboard"}>{renderButtons()}</div>;
};

export default AdminDashboard;
