import React from "react";

const BuildingStep = ({ data }) => {
  const renderItemInputs = () => {
    // returns the small items displayed in each container - name & qty
    return data.inputs.map(
      input =>
        input && (
          <div className={"item-input"}>
            <p>{truncateDecimals(input.qty, 3)}</p>
            <p>{input.item.itemName}</p>
          </div>
        )
    );
  };

  const truncateDecimals = function (number, digits) {
    var multiplier = Math.pow(10, digits),
      adjustedNum = number * multiplier,
      truncatedNum = Math[adjustedNum < 0 ? "ceil" : "floor"](adjustedNum);

    return truncatedNum / multiplier;
  };

  return (
    <div className={"container building-step"}>
      <h2>
        ({truncateDecimals(data.qty, 3)}) {data.item.itemName}
      </h2>
      <h3>
        Recipe:{" "}
        {data.recipe?.category === "standard" ? "Standard" : data.recipe?.recipeName}
      </h3>
      <h3>
        Requires: ({truncateDecimals(data.buildingCount, 4)}) {data.building?.title}
      </h3>
      <div className={"item-inputs"}>{renderItemInputs()}</div>
    </div>
  );

  // const renderInputs = () => {
  //   // returns a new generation by recursion
  //   return data.inputs.map(
  //     input => input?.building && <BuildingStep data={input} />
  //   );
  // };

  // return (
  //   <div className={"generation"}>
  //     <div className={"container building-step"} style={{ display: "block" }}>
  //       <h2>
  //         ({data.qty}) {data.item?.itemName}
  //       </h2>
  //       <h3>
  //         Recipe:{" "}
  //         {data.recipe.category === "standard" ? "Standard" : data.recipe.recipeName}
  //       </h3>
  // <h3>
  //   Requires: ({data.buildingCount}) {data.building.title}
  // </h3>
  //   <div className={"item-inputs"}>{renderItemInputs()}</div>
  // </div>
  // <div className={"inputs"}>{renderInputs()}</div>
  //   </div>
  // );
};

export default BuildingStep;
