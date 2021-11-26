import React, { useMemo, useReducer } from "react";
import Map from "./map/Map";

import useData from "hooks/useData";
import buildingStepsReducer from "reducers/buildingStepsReducer";
import ControlPanel from "./ui/ControlPanel";
import "stylesheets/FactoryBuilder.css";

const FactoryBuilder = () => {
  const [buildingSteps, dispatch] = useReducer(buildingStepsReducer, []);
  const { items, recipes } = useData();

  return (
    <div className={"factory-builder"}>
      <button
        onClick={() => console.log("factory tree", [...buildingSteps])}
        style={{ height: "2rem", width: "7rem", position: "absolute" }}
      >
        Factory Tree
      </button>
      <ControlPanel items={items} data={buildingSteps} dispatch={dispatch} />
      <Map data={buildingSteps} recipes={recipes} dispatch={dispatch} />
    </div>
  );
};

export default FactoryBuilder;
