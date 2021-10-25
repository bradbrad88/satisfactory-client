import React from "react";
import EditList from "./EditList";

const EditScreen = ({ component }) => {
  console.log("props", component);
  return <EditList />;
};

export default EditScreen;
