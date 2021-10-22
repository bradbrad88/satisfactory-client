import React, { useState, useEffect } from "react";
import useAdmin from "../../hooks/useAdmin";
import EditList from "./EditList";

const EditScreen = ({ component }) => {
  console.log("props", component);
  return <EditList />;
};

export default EditScreen;
