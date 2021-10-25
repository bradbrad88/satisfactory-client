import React from "react";
import { useHistory } from "react-router";
import { adminSetup } from "./adminSetup";

const AdminDashboard = () => {
  const history = useHistory();
  const handleClick = path => {
    history.push(path);
  };

  const renderButtons = () => {
    return adminSetup.map(section => (
      <button
        key={section.title}
        className={"admin-sections"}
        onClick={() => handleClick(section.path)}
      >
        {section.icon}
        <h3>{section.title}</h3>
      </button>
    ));
  };
  return <div className={"admin-dashboard"}>{renderButtons()}</div>;
};

export default AdminDashboard;
