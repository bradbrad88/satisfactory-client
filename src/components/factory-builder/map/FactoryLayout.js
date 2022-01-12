import React, { useState, useMemo, useContext, useRef, useCallback } from "react";
import GridLayout from "brad-grid-layout";
// import BuildingRow from "./BuildingRow";
import BuildingStep from "./BuildingStep";
import RecipeSelector from "./RecipeSelector";
import { dragHandle } from "utils/SvgIcons";
import {
  INPUT_DROPPED_ON_LAYOUT,
  BYPRODUCT_DROPPED_ON_MAP,
  SET_CANVAS_WIDTH,
  UPDATE_LAYOUT_PROPS,
  FORCE_LAYOUT_RENDER,
} from "reducers/factoryManagerReducer";
import {
  FactoryManagerContext,
  GRID_COL_WIDTH,
  GRID_ROW_HEIGHT,
} from "contexts/FactoryManagerContext";
// import "../../../../node_modules/brad-grid-layout/css/styles.css";
// import "../../../../node_modules/react-resizable/css/styles.css";

const FactoryLayout = ({ scale }) => {
  const { activeFactory, layout, canvasWidth, dispatch } =
    useContext(FactoryManagerContext);
  const [dragState, setDragState] = useState(false);
  const [upstreamRecipeSelector, setUpstreamRecipeSelector] = useState(null);
  // react-grid-layout needs its scale disabled when dealing with items dragged in from outside
  const [disableScale, setDisableScale] = useState(false);
  const [droppable, setDroppable] = useState(false);
  const ref = useRef();

  const dragOverBuildingStep = useCallback(() => {
    dispatch({ type: FORCE_LAYOUT_RENDER });
  });
  const renderBuildingSteps = useMemo(() => {
    if (scale) {
    }
    if (!activeFactory) return null;
    const buildingSteps = activeFactory.buildingSteps.map(buildingStep => (
      <BuildingStep
        key={buildingStep.id}
        data={buildingStep}
        setDragState={e => setDragState(e)}
        handleDragOver={dragOverBuildingStep}
        setDroppable={setDroppable}
      />
    ));
    return buildingSteps;
  }, [activeFactory, scale, layout]);

  const onDragStart = (layout, oldItem, newItem, placeholder, e) => {
    e.stopPropagation();
    if (oldItem.i === "outside") setDisableScale(true);
    console.log("layout", layout);
    console.log("old item", oldItem);
    console.log("new item", newItem);
    console.log("placeholder", placeholder);
  };

  const handleTopEdge = layout => {
    if (layout.some(layoutItem => layoutItem.y === 0)) {
      layout.forEach(layoutItem => {
        console.log("handle top edge", layoutItem);
        layoutItem.y += 1;
      });
    }
  };

  const onDragStop = (layout, oldItem, newItem, placeholder, event, element) => {
    handleTopEdge(layout);
    console.log("stopping the dragon");
  };

  const onDrop = (layout, layoutItem, e) => {
    const { dataTransfer } = e;
    setDisableScale(false);
    try {
      const { dataTransfer } = e;
      const data = JSON.parse(dataTransfer.getData("text/plain"));
      if (data.fromInput) {
        handleInputDrop(data, layoutItem);
      }
    } catch (error) {}
  };

  const handleInputDrop = (inputData, layoutItem) => {
    const type = INPUT_DROPPED_ON_LAYOUT;
    const payload = { inputData, layoutItem };
    dispatch({ type, payload });
  };

  const onDropDragOver = e => {
    if (!droppable) {
      console.log("returning false");
      return false;
    }
  };

  const onLayoutChange = layout => {
    const payload = { layout };
    const type = UPDATE_LAYOUT_PROPS;
  };

  const extendCanvas = () => {
    const type = SET_CANVAS_WIDTH;
    const payload = { width: 2 * GRID_COL_WIDTH + canvasWidth };
    dispatch({ type, payload });
  };

  const onDrag = (layout, oldItem, newItem, placeholder, event, element) => {
    if (placeholder.x === 0) extendCanvas();
    const maxCols = canvasWidth / GRID_COL_WIDTH;
    if (placeholder.x + placeholder.w >= maxCols) extendCanvas();
  };

  return (
    <GridLayout
      className="factory-layout layout"
      style={{
        minWidth: `${canvasWidth}px`,
        paddingBottom: `${GRID_ROW_HEIGHT * 3}px`,
      }}
      rowHeight={GRID_ROW_HEIGHT}
      cols={canvasWidth / GRID_COL_WIDTH}
      width={canvasWidth}
      resizeHandles={[]}
      layout={activeFactory?.layout}
      compactType={null}
      isDraggable={true}
      onDragStop={onDragStop}
      onDragStart={onDragStart}
      transformScale={disableScale ? 1 : scale}
      onLayoutChange={onLayoutChange}
      onDrag={onDrag}
      onDropDragOver={onDropDragOver}
      isDroppable={true}
      onDrop={onDrop}
      droppingItem={{ i: "outside", h: 1, w: 25, transformScale: scale }}

      // draggableCancel=".building-step"
    >
      {renderBuildingSteps}
    </GridLayout>
  );
};

export default FactoryLayout;
