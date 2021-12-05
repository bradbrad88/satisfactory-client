import React, { useReducer, useState } from "react";
import Map from "./map/Map";

import useData from "hooks/useData";
import buildingStepsReducer from "reducers/buildingStepsReducer";
import ControlPanel from "./ui/ControlPanel";
import "stylesheets/FactoryBuilder.css";

const FactoryBuilder = ({}) => {
  const [mapState, setMapState] = useState("build");
  const [buildingSteps] = useReducer(buildingStepsReducer, []);

  return (
    <div className={"factory-builder"}>
      <button
        onClick={() => console.log("factory tree", [...buildingSteps])}
        style={{ height: "2rem", width: "7rem", position: "absolute" }}
      >
        Factory Tree
      </button>
      <button
        onClick={() => console.log("factory tree", [...buildingSteps])}
        style={{ height: "2rem", width: "7rem", position: "absolute", left: "7rem" }}
      >
        Save Factories
      </button>
      <ControlPanel setMapState={mapState => setMapState(mapState)} />
      <Map mapState={mapState} />
    </div>
  );
};

export default FactoryBuilder;
