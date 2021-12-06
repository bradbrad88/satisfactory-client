import React, { useState } from "react";
import Map from "./map/Map";
import ControlPanel from "./ui/ControlPanel";
import "stylesheets/FactoryBuilder.css";

const UiController = () => {
  const [mapState, setMapState] = useState("build");

  const setNewMapState = newState => {
    setMapState(newState);
  };

  return (
    <div className={"factory-builder"}>
      <ControlPanel setMapState={setNewMapState} />
      <Map mapState={mapState} />
    </div>
  );
};

export default UiController;
