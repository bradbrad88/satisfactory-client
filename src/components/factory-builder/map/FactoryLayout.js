import React, { useState, useMemo, useContext, useRef, useCallback } from "react";
import GridLayout from "brad-grid-layout";
import BuildingStep from "./BuildingStep";
import RecipeSelector from "./RecipeSelector";
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

const FactoryLayout = ({ scale }) => {
  const { activeFactory, layout, canvasWidth, dispatch } =
    useContext(FactoryManagerContext);
  const [dragState, setDragState] = useState(false);
  const [upstreamRecipeSelector, setUpstreamRecipeSelector] = useState(null);
  // react-grid-layout needs its scale disabled when dealing with items dragged in from outside
  const [disableScale, setDisableScale] = useState(false);
  const [dropDisplay, setDropDisplay] = useState({});
  const [hidePlaceholder, setHidePlaceholder] = useState(false);
  const ref = useRef();
  // A ref used to make sure a drop event only occurs on the intended element.
  // StopPropation() unable to be used on grid item as it prevents placeholder cleanup
  const singleFireRef = useRef();

  const dragOverBuildingStep = useCallback(() => {
    dispatch({ type: FORCE_LAYOUT_RENDER });
  });

  // A hacky solution to prevent onDrop firing for both a buildingStep and map drop
  const disarmSingleFireRef = useCallback(() => {
    singleFireRef.current = false;
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
        dropDisplay={dropDisplay}
        setDropDisplay={setDropDisplay}
        setHidePlaceholder={setHidePlaceholder}
        setDisableScale={setDisableScale}
        disarmSingleFireRef={disarmSingleFireRef}
      />
    ));
    return buildingSteps;
  }, [activeFactory, scale, layout, dropDisplay]);

  const onDragStart = (layout, oldItem, newItem, placeholder, e) => {
    e.stopPropagation();
    if (oldItem.i === "outside") {
      singleFireRef.current = true;
      setDisableScale(true);
    }
  };

  const handleTopEdge = layout => {
    console.log("handling top edge");
    if (layout.some(layoutItem => layoutItem.y === 0)) {
      const newLayout = layout.map(layoutItem => ({
        ...layoutItem,
        y: (layoutItem.y += 1),
      }));
      return newLayout;
    }
    return layout;
  };

  const onDragStop = (layout, oldItem, newItem, placeholder, event, element) => {
    setDisableScale(false);
    const type = UPDATE_LAYOUT_PROPS;
    const payload = { layout };
    dispatch({ type, payload });
  };

  const onDrop = (layout, layoutItem, e) => {
    console.log("single fire ref", singleFireRef.current);
    if (singleFireRef.current === false) return;
    disarmSingleFireRef();
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

  const onLayoutChange = layout => {
    console.log("on layout change");
    const updatedLayout = handleTopEdge(layout);
    if (updatedLayout !== layout) {
      const payload = { layout: updatedLayout };
      const type = UPDATE_LAYOUT_PROPS;
      dispatch({ type, payload });
    }
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
      onDragStart={onDragStart}
      onDragStop={onDragStop}
      transformScale={disableScale ? 1 : scale}
      onLayoutChange={onLayoutChange}
      isDroppable={true}
      onDrag={onDrag}
      onDrop={onDrop}
      droppingItem={{ i: "outside", h: 3, w: 25, transformScale: scale }}
      hidePlaceholder={hidePlaceholder}
    >
      {renderBuildingSteps}
    </GridLayout>
  );
};

export default FactoryLayout;
