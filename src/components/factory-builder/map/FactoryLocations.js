import React, { useRef } from "react";
import MapLabel from "./MapLabel";
import map from "assets/map.webp";

const FactoryLocations = ({ factories, activeFactory, setActiveFactory }) => {
  const ref = useRef();
  const renderLocations = () => {
    if (!ref.current) return null;
    const { height, width } = ref.current?.getBoundingClientRect();
    return factories.map(factory => (
      <MapLabel
        item={factory}
        mapDimensions={{ height, width }}
        activeFactory={activeFactory}
        setActiveFactory={setActiveFactory}
      />
    ));
  };

  console.log("factories", factories);
  return (
    <div ref={ref} className={"factory-locations"}>
      {renderLocations()}
      <img src={map} draggable={false} />
    </div>
  );
};

export default FactoryLocations;
