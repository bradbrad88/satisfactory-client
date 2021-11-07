import React, { useMemo } from "react";
import Select from "../Select";

const Building = ({ value, onChange, items }) => {
  const buildings = useMemo(() => {
    const list = items
      .sort((a, b) => a.category > b.category)
      .map(building => ({ title: building.title, id: building.buildingId }));
    list.unshift({ title: "SELECT A BUILDING", id: "" });
    return list;
  }, [items]);
  return (
    <div className={"field"}>
      <label>BUILDING</label>
      <Select
        title={"BUILDING"}
        options={buildings}
        value={value}
        onChange={onChange}
        id={"recipe-building"}
      />
    </div>
  );
};

export default Building;
