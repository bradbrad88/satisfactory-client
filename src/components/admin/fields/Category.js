import React from "react";
import Select from "../../elements/Select";

const Category = ({ item, value, onChange }) => {
  const options = [
    "ore",
    "liquid",
    "gas",
    "material",
    "component",
    "fuel",
    "ammo",
    "special",
    "waste",
  ];
  return (
    <div className="field">
      <label htmlFor={`category${item && "update"}`}>CATEGORY</label>
      <Select
        title={"CATEGORY"}
        value={value}
        onChange={onChange}
        id={`category${item && "update"}`}
        options={options}
      />
    </div>
  );
};

export default Category;
