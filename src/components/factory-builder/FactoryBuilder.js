import React, { useReducer, useState } from "react";
import Map from "./map/Map";

import useData from "hooks/useData";
import buildingStepsReducer from "reducers/buildingStepsReducer";
import ControlPanel from "./ui/ControlPanel";
import "stylesheets/FactoryBuilder.css";

const FactoryBuilder = ({
  factories,
  activeFactory,
  // addNewFactory,
  setActiveFactory,
  dispatch,
}) => {
  const [mapState, setMapState] = useState("build");
  const [buildingSteps] = useReducer(buildingStepsReducer, []);

  // const [factoryName, setFactoryName] = useState("");
  // const [location, setLocation] = useState({ x: 0, y: 0 });
  const { items, recipes } = useData();

  const saveFactories = () => {};

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
      {/* <div>
        <label>Factory Name</label>
        <input type={"text"} />
      </div> */}
      <ControlPanel
        items={items}
        data={buildingSteps}
        dispatch={dispatch}
        setMapState={mapState => setMapState(mapState)}
        factories={factories}
        activeFactory={activeFactory}
        setActiveFactory={setActiveFactory}
        // addNewFactory={addNewFactory}
      />
      <Map
        factories={factories}
        activeFactory={activeFactory}
        setActiveFactory={setActiveFactory}
        data={buildingSteps}
        recipes={recipes}
        dispatch={dispatch}
        mapState={mapState}
      />
    </div>
  );
};

export default FactoryBuilder;
