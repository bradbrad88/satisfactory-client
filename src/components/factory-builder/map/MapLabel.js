import React, { useState } from "react";

const MapLabel = ({
  item,
  activeFactory,
  setActiveFactory,
  relocate,
  mapDimensions,
}) => {
  const [startLocation, setStartLocation] = useState();
  const { location } = item;
  // console.log("map dimensions", mapDimensions);
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
    console.log("e.target", e.target);
    const rect = e.target.getBoundingClientRect();
    console.log("rect", rect);
    setStartLocation();
  };

  const onMouseUp = () => {
    // console.log("mouse up bitches");
  };

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
