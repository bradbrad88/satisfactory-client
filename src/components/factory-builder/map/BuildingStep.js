import React from "react";

const BuildingStep = ({ data }) => {
  const renderInputs = () => {
    // returns a new generation by recursion
    return data.inputs.map(
      input => input?.building && <BuildingStep data={input} />
    );
  };

  const renderItemInputs = () => {
    // returns the small items displayed in each container - name & qty
    return data.inputs.map(
      input =>
        input && (
          <div className={"item-input"}>
            <p>{input.qty}</p>
            <p>{input.item.itemName}</p>
          </div>
        )
    );
  };

  return (
    <div className={"generation"}>
      <div className={"container building-step"} style={{ display: "block" }}>
        <h2>
          ({data.qty}) {data.item.itemName}
        </h2>
        <h3>
          Recipe:{" "}
          {data.recipe.category === "standard" ? "Standard" : data.recipe.recipeName}
        </h3>
        <h3>
          Requires: ({data.buildingCount}) {data.building.title}
        </h3>
        <div className={"item-inputs"}>{renderItemInputs()}</div>
      </div>
      <div className={"inputs"}>{renderInputs()}</div>
    </div>
  );
};

export default BuildingStep;
