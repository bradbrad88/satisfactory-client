import React, { useState, useEffect } from "react";
import Select from "../../elements/Select";
import conveyor from "../../../assets/conveyor.webp";
import pipe from "../../../assets/pipe.webp";

const RecipeItem = ({ items, direction, type, onChange, value }) => {
  const image = () => {
    switch (type) {
      case "conveyor":
        return conveyor;
      case "pipe":
        return pipe;
      default:
        break;
    }
  };

  const handleItemChange = e => {
    const newState = { ...value, itemId: parseInt(e.target.value), direction, type };
    onChange(newState, value);
  };

  const handleQtyChange = e => {
    const newState = { ...value, qty: e.target.value, direction, type };
    onChange(newState, value);
  };

  return (
    <div>
      <img src={image()} style={{ width: "40px" }} />
      <Select
        options={items}
        value={value?.itemId || ""}
        onChange={handleItemChange}
      />
      <input type={"number"} value={value?.qty || 0} onChange={handleQtyChange} />
    </div>
  );
};

export default RecipeItem;
