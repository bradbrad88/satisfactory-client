import React, { useState, useEffect } from "react";
import truncateDecimals from "utils/truncateDecimals";
import conveyor from "assets/conveyor.webp";
import pipe from "assets/pipe.webp";
import { BYPRODUCT_DROPPED_ON_INPUT } from "reducers/buildingStepsReducer";

const Input = ({ inputData, buildingStep, inputDrag, setTempNull, dispatch }) => {
  const [dragImg, setDragImg] = useState(null);
  const [validDrag, setValidDrag] = useState(false);

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp);
    const img = new Image(20, 20);
    img.src = inputData.item.transportType === "conveyor" ? conveyor : pipe;
    img.onload = () => setDragImg(img);
    return () => window.removeEventListener("mouseup", onMouseUp);
  }, [inputData.item.transportType]);

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

  const onMouseUp = () => {};

  const shortfall = inputData.qty - suppliedQty();
  const className = shortfall < 0 ? "over" : shortfall > 0 ? "under" : "";

  const onDragStart = e => {
    const data = {
      fromInput: true,
      inputId: inputData.id,
      itemId: inputData.item.itemId,
      itemName: inputData.item.itemName,
      qty: shortfall < 0 ? 0 : shortfall,
      row: buildingStep.ver + 1,
      buildingStep: buildingStep.id,
    };
    e.dataTransfer.setDragImage(dragImg, 0, 0);
    e.dataTransfer.setData("text/plain", JSON.stringify(data));
  };

  const onDragEnd = () => {
    setTempNull();
  };

  const getDataFromDrop = e => {
    try {
      const data = e.dataTransfer.getData("text/plain");
      const parsedData = JSON.parse(data);
      console.log("parsed data", parsedData);
      return parsedData;
    } catch (error) {
      return {};
    }
  };

  const onDragEnter = e => {
    e.preventDefault();
    const { fromByProduct, itemId } = getDataFromDrop(e);
    if (fromByProduct && itemId === inputData.item.itemId) {
      e.stopPropagation();
      setValidDrag(true);
    }
  };

  const onDragLeave = () => {
    console.log("drag leaving");
    setValidDrag(false);
  };

  const onDrop = e => {
    const { buildingStepId, itemId, fromByProduct } = getDataFromDrop(e);
    if (!fromByProduct) return;
    e.stopPropagation();
    const type = BYPRODUCT_DROPPED_ON_INPUT;
    const payload = {
      buildingStepId,
      itemId,
      inputBuildingStep: buildingStep,
      input: inputData,
    };
    dispatch({ type, payload });
    setValidDrag(false);
  };

  return (
    <div
      className={`item-input ${className} ${validDrag && "valid-drag"}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <p>{truncateDecimals(inputData.qty, 3)}</p>
      <p>{inputData.item.itemName}</p>
      <p>{truncateDecimals(shortfall, 3)}</p>
    </div>
  );
};

export default Input;
