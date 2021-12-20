import React, { useRef, useState, useContext } from "react";
import OutsideAlerter from "utils/OutsideAlerter";
import { SET_OUTPUT_QTY } from "reducers/factoryManagerReducer";
// import { item } from "utils/SvgIcons";
import { useEffect } from "react/cjs/react.development";
import conveyor from "assets/conveyor.webp";
import pipe from "assets/pipe.webp";
import truncateDecimals from "utils/truncateDecimals";
import { FactoryManagerContext } from "contexts/FactoryManagerContext";

const Output = ({ outputData }) => {
  const { qty, buildingStep } = outputData;
  const { dispatch } = useContext(FactoryManagerContext);
  const [active, setActive] = useState(false);
  const [dragImg, setDragImg] = useState(null);
  const [newValue, setNewValue] = useState("");
  const ref = useRef();
  useEffect(() => {
    const img = new Image(20, 20);
    img.src = outputData.item.transportType === "conveyor" ? conveyor : pipe;
    img.style.width = "20px";
    img.style.height = "20px";
    // document.querySelector("#root").prepend(img);
    img.onload = () => setDragImg(img);
  }, [outputData.item.transportType]);

  const onClickOutside = e => {
    setActive(false);
  };

  const onClickInside = e => {
    if (active) return;
    setNewValue(outputData.qty);
    setActive(true);
    setFocus();
  };

  const onKeyDown = e => {
    const { key } = e;
    if (key === "Enter") {
      const type = SET_OUTPUT_QTY;
      const payload = {
        buildingStep,
        output: outputData,
        qty: parseFloat(newValue),
      };
      dispatch({ type, payload });
      setActive(false);
    }
  };

  const setFocus = () => {
    setTimeout(() => {
      ref.current?.select();
    }, 0);
  };

  const onDragStart = e => {
    e.dataTransfer.setDragImage(dragImg, 0, 0);
  };

  const goingTo = () => {
    switch (outputData.type) {
      case "step":
        return outputData.input.buildingStep.item.itemName;
      case "sink":
        return "a resource sink";
      case "export":
        return "another factory";
      default:
        break;
    }
  };

  return (
    // <OutsideAlerter onClickOutside={onClickOutside} onClickInside={onClickInside}>
    <div
      className={`item-output ${outputData.byProduct && "by-product"}`}
      // onClickCapture={onClickInside}
      onMouseDown={e => e.stopPropagation()}
      draggable
      onDragStart={onDragStart}
    >
      <input
        ref={ref}
        type={"number"}
        value={newValue}
        onKeyDown={onKeyDown}
        onChange={e => setNewValue(e.target.value)}
        style={{ display: active ? "block" : "none" }}
      />
      <p style={{ display: active ? "none" : "block" }}>
        {truncateDecimals(qty, 3)}
      </p>
      <p>Going to {goingTo()}</p>
      {/* <p>{active ? "active" : "not active"}</p> */}
    </div>
    // </OutsideAlerter>
  );
};

export default Output;
