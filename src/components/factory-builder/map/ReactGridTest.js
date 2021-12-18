import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import "../../../../node_modules/react-grid-layout/css/styles.css";
import "../../../../node_modules/react-resizable/css/styles.css";
import { dragHandle } from "utils/SvgIcons";

const WIDTH = 5010;

const ReactGridTest = ({ scale }) => {
  const [dragState, setDragState] = useState(false);
  const [layout, setLayout] = useState([
    { i: "0", x: 0, y: 0, h: 1, w: 5, isBounded: true },
    { i: "b", x: 0, y: 0, h: 1, w: 5 },
    // { i: "c", x: 0, y: 0, h: 2, w: 5 },
  ]);

  const onDragStart = (_, __, ___, ____, m) => {
    m.stopPropagation();
  };

  const dragEnable = e => {
    setDragState(true);
  };

  const dragDisable = () => {
    setDragState(false);
  };

  const onDrop = (layout, oldItem, newItem, placeholder, event, element) => {
    if (newItem.y === 0) {
      console.log("layout", layout);
      layout.forEach(layoutItem => {
        layoutItem.y += 1;
      });
    }
  };

  const onLayoutChange = layout => {
    console.log("layout", layout);
  };

  const onDrag = () => {};

  return (
    <GridLayout
      className="factory-layout layout"
      style={{ minWidth: `${WIDTH}px` }}
      rowHeight={300}
      cols={167}
      width={WIDTH}
      resizeHandles={[]}
      layout={layout}
      compactType={null}
      isDraggable={dragState}
      onDragStop={onDrop}
      onDragStart={onDragStart}
      transformScale={scale}
      onLayoutChange={onLayoutChange}
      onDrag={onDrag}
    >
      {/* <div key={0} style={{ backgroundColor: dragState ? "red" : "blue" }}>
        <div
          style={{
            userSelect: "none",
            display: "inline-block",
            boxSizing: "border-box",
          }}
          onMouseEnter={dragEnable}
          onMouseLeave={dragDisable}
        >
          {dragHandle(40)}
        </div>
        <p>0</p>
      </div>
      <div key={"b"} style={{ backgroundColor: dragState ? "red" : "blue" }}>
        <div
          style={{ userSelect: "none", display: "inline-block" }}
          onMouseEnter={dragEnable}
          onMouseLeave={dragDisable}
        >
          {dragHandle(40)}
        </div>
        <p>b</p>
      </div> */}
    </GridLayout>
  );
};

export default ReactGridTest;
