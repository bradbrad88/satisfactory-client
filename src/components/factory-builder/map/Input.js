import React, { useMemo, useEffect } from "react";
import { useCallback } from "react/cjs/react.development";
import truncateDecimals from "utils/truncateDecimals";

const Input = ({ inputData }) => {
  // const { suppliedQty } = inputData;

  const suppliedQty = () => {
    const suppliedQty = inputData.buildingSteps.reduce((total, bs) => {
      const relatedOutput = bs.outputs.find(output => output.id === inputData.id);
      if (!relatedOutput) {
        console.log(
          "error finding related input when calculating supplied input qty"
        );
        return total;
      }
      return total + parseFloat(relatedOutput.qty);
    }, 0);
    console.log("supplied qty", suppliedQty);
    return suppliedQty;
  };

  const shortfall = inputData.qty - suppliedQty();
  console.log("input qty", inputData.qty);
  // console.log("supplied qty", suppliedQty());
  console.log("shortfall", shortfall);
  const className = shortfall < 0 ? "over" : shortfall > 0 ? "under" : "";
  console.log("supplied qty", suppliedQty());
  return (
    <div className={`item-input ${className}`}>
      <p>{truncateDecimals(inputData.qty, 3)}</p>
      <p>{inputData.item.itemName}</p>
      <p>{truncateDecimals(shortfall, 3)}</p>
    </div>
  );
};

export default Input;
