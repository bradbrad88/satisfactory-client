import React from "react";
import BuildingStep from "./BuildingStep";

const Map = ({ data }) => {
  return <div className={"map"}>{data && <BuildingStep data={data} />}</div>;
};

export default Map;
