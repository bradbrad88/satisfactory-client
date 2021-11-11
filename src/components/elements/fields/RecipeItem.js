import React, { useMemo } from "react";
import Select from "../Select";
import conveyor from "../../../assets/conveyor.webp";
import pipe from "../../../assets/pipe.webp";

const RecipeItem = ({ items, direction, type, onChange, value }) => {
  const image = useMemo(() => {
    switch (type) {
      case "conveyor":
        return { image: conveyor, alt: "conveyor item" };
      case "pipe":
        return { image: pipe, alt: "pipe item" };
      default:
        break;
    }
  }, [type]);

  const handleItemChange = e => {
    if (!parseInt(e.target.value)) return onChange(null, value);
    const newState = { ...value, itemId: parseInt(e.target.value), direction, type };
    onChange(newState, value);
  };

  const handleQtyChange = e => {
    if (!parseFloat(e.target.value)) return onChange(null, value);
    const newState = { ...value, qty: e.target.value, direction, type };
    onChange(newState, value);
  };

  return (
    <div>
      <img src={image.image} style={{ width: "40px" }} alt={image.alt} />
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
