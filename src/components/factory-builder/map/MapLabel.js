import { FactoryManagerContext } from "contexts/FactoryManagerContext";
import React, { useContext, useState } from "react";

const MapLabel = ({ item }) => {
  const { activeFactory, setActiveFactory } = useContext(FactoryManagerContext);
  const [startLocation, setStartLocation] = useState();
  const { location } = item;
  const style = () => {
    const { x, y } = location;
    return {
      left: `${x}%`,
      top: `${y}%`,
      transform: "scale(1)",
    };
  };

  const onMouseDown = e => {
    e.stopPropagation();
    setActiveFactory(item.id);
    const rect = e.target.getBoundingClientRect();
    setStartLocation();
  };

  const onMouseUp = () => {};

  const active = () => {
    if (activeFactory === item) return true;
    return false;
  };

  return (
    <div
      className={`map-label ${active() ? "active" : ""}`}
      style={style()}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {item.factoryName}
    </div>
  );
};

export default MapLabel;
