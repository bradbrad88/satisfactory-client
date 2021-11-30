import React, { useState, useEffect } from "react";
import OutsideAlerter from "utils/OutsideAlerter";
import truncateDecimals from "utils/truncateDecimals";
import conveyor from "assets/conveyor.webp";
import pipe from "assets/pipe.webp";

const ByProduct = ({ byProductData }) => {
  const { item, qty, buildingStep } = byProductData;
  const [dragImg, setDragImg] = useState(null);
  useEffect(() => {
    const img = new Image(20, 20);
    img.src = item.transportType === "conveyor" ? conveyor : pipe;
    img.onload = () => setDragImg(img);
  }, [item.transportType]);

  const onClickOutside = () => {
    console.log("clicked outside by-product");
  };

  const onClickInside = () => {
    console.log("clicked inside by-product");
  };

  const onDragStart = e => {
    e.dataTransfer.setDragImage(dragImg, 0, 0);
    const data = {
      fromByProduct: true,
      itemId: item.itemId,
      // itemName: item.itemName,
      // qty: byProductData.qty,
      byProductId: byProductData.id,
      buildingStepId: buildingStep.id,
    };
    e.dataTransfer.setData("text/plain", JSON.stringify(data));
  };

  return (
    <OutsideAlerter onClickInside={onClickInside} onClickOutside={onClickOutside}>
      <div
        className={`item-output by-product`}
        draggable
        onMouseDown={e => e.stopPropagation()}
        onDragStart={onDragStart}
      >
        <p>{item.itemName}</p>
        <p>{truncateDecimals(qty, 3)}</p>
      </div>
    </OutsideAlerter>
  );
};

export default ByProduct;
