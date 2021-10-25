import React, { useMemo } from "react";
import useApi from "../../../hooks/useApi";
import Select from "../../elements/Select";

const Building = () => {
  const { items, working } = useApi("buildings");
  const buildings = useMemo(() => {
    return items
      .sort((a, b) => a.category > b.category)
      .map(building => ({ title: building.title, id: building.buildingId }));
  }, [items]);
  console.log("items", items);
  return (
    <div className={"field"}>
      <label>BUILDING</label>
      <Select title={"BUILDING"} options={buildings} />
    </div>
  );
};

export default Building;
