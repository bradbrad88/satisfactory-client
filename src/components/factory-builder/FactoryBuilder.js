import React, { useMemo, useReducer } from "react";
import Map from "./map/Map";
import UserInput from "./ui/UserInput";
import "stylesheets/FactoryBuilder.css";
import useData from "hooks/useData";
import buildingStepsReducer from "reducers/buildingStepsReducer";
import ControlPanel from "./ui/ControlPanel";

const FactoryBuilder = () => {
  const [buildingSteps, dispatch] = useReducer(buildingStepsReducer, []);
  const { items } = useData();

  return (
    <div className={"factory-builder"}>
      <button
        onClick={() => console.log("factory tree", [...buildingSteps])}
        style={{ height: "2rem", width: "7rem", position: "absolute" }}
      >
        Factory Tree
      </button>
      {/* <UserInput  items={items} data={buildingSteps} dispatch={dispatch}/> */}
      <ControlPanel items={items} data={buildingSteps} dispatch={dispatch} />
      <Map data={buildingSteps} dispatch={dispatch} />
    </div>
  );
};

export default FactoryBuilder;
