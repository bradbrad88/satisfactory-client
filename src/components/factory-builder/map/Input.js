import React, { useState, useEffect } from "react";
import truncateDecimals from "utils/truncateDecimals";
import conveyor from "assets/conveyor.webp";
import pipe from "assets/pipe.webp";

const Input = ({ inputData, buildingStep, inputDrag }) => {
  const [dragImg, setDragImg] = useState(null);

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp);
    const img = new Image(20, 20);
    img.src = inputData.item.transportType === "conveyor" ? conveyor : pipe;
    img.onload = () => setDragImg(img);
    return () => window.removeEventListener("mouseup", onMouseUp);
  }, []);

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

    return suppliedQty;
  };

  const onMouseDown = e => {
    e.stopPropagation();
    inputDrag(inputData, buildingStep);
  };

  const onDragStart = e => {
    const data = {
      inputId: inputData.id,
      itemId: inputData.item.itemId,
      itemName: inputData.item.itemName,
      qty: inputData.qty,
      row: buildingStep.ver + 1,
      buildingStep: buildingStep.id,
    };
    e.dataTransfer.setDragImage(dragImg, 0, 0);
    e.dataTransfer.setData("text/plain", JSON.stringify(data));
  };

  const onMouseUp = () => {};

  const shortfall = inputData.qty - suppliedQty();
  const className = shortfall < 0 ? "over" : shortfall > 0 ? "under" : "";
  return (
    <div
      className={`item-input ${className}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      draggable
      onDragStart={onDragStart}
    >
      <p>{truncateDecimals(inputData.qty, 3)}</p>
      <p>{inputData.item.itemName}</p>
      <p>{truncateDecimals(shortfall, 3)}</p>
    </div>
  );
};

export default Input;
