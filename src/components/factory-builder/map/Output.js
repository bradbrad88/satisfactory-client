import React, { useRef, useState } from "react";
import OutsideAlerter from "utils/OutsideAlerter";
import { SET_OUTPUT_QTY } from "reducers/buildingStepsReducer";
// import { item } from "utils/SvgIcons";
import { useEffect } from "react/cjs/react.development";
import conveyor from "assets/conveyor.webp";
import pipe from "assets/pipe.webp";
import truncateDecimals from "utils/truncateDecimals";

const Output = ({ outputData, dispatch }) => {
  const { qty, buildingStep } = outputData;
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

  return (
    <OutsideAlerter onClickOutside={onClickOutside} onClickInside={onClickInside}>
      <div
        className={`item-output ${outputData.byProduct && "by-product"}`}
        // onClickCapture={onClickInside}
        onMouseDown={e => e.stopPropagation()}
        draggable
        onDragStart={onDragStart}
      >
        <p>
          {outputData.byProduct
            ? outputData.item.itemName
            : outputData.input.buildingStep.item.itemName}
        </p>
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
        {/* <p>{active ? "active" : "not active"}</p> */}
      </div>
    </OutsideAlerter>
  );
};

export default Output;
