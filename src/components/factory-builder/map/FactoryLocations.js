import React, { useContext, useRef } from "react";
import MapLabel from "./MapLabel";
import map from "assets/map.webp";
import { FactoryManagerContext } from "contexts/FactoryManagerContext";

const FactoryLocations = () => {
  const { factories } = useContext(FactoryManagerContext);
  const ref = useRef();
  const renderLocations = () => {
    if (!ref.current) return null;
    const { height, width } = ref.current?.getBoundingClientRect();
    return factories.map(factory => (
      <MapLabel item={factory} mapDimensions={{ height, width }} />
    ));
  };

  return (
    <div ref={ref} className={"factory-locations"}>
      {renderLocations()}
      <img src={map} draggable={false} />
    </div>
  );
};

export default FactoryLocations;
