import React from "react";

const Output = ({ outputData }) => {
  const { item, qty, buildingStep } = outputData;
  return (
    <div className={`item-output ${outputData.byProduct && "by-product"}`}>
      <p>{item.itemName}</p>
      <p>{qty}</p>
    </div>
  );
};

export default Output;
