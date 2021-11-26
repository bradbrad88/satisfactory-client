import React from "react";
import Select from "../Select";

const Category = ({ item, value, onChange, options, label, style }) => {
  return (
    <div className="field">
      <label htmlFor={`category${item && "update"}`}>{label}</label>
      <Select
        title={"CATEGORY"}
        value={value}
        onChange={onChange}
        id={`category${item && "update"}`}
        options={options}
        style={style}
      />
    </div>
  );
};

export default Category;
