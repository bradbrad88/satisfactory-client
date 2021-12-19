import React, { useState, useMemo, useContext, useRef, useCallback } from "react";
import GridLayout from "react-grid-layout";
// import BuildingRow from "./BuildingRow";
import BuildingStep from "./BuildingStep";
import RecipeSelector from "./RecipeSelector";
import { dragHandle } from "utils/SvgIcons";
import {
  INPUT_DROPPED_ON_MAP,
  BYPRODUCT_DROPPED_ON_MAP,
  SET_CANVAS_WIDTH,
  UPDATE_LAYOUT_PROPS,
} from "reducers/factoryManagerReducer";
import {
  FactoryManagerContext,
  GRID_COL_WIDTH,
  GRID_ROW_HEIGHT,
} from "contexts/FactoryManagerContext";
import "../../../../node_modules/react-grid-layout/css/styles.css";
import "../../../../node_modules/react-resizable/css/styles.css";

// const WIDTH = 1000;

const FactoryLayout = ({ scale }) => {
  const { activeFactory, layout, canvasWidth, dispatch } =
    useContext(FactoryManagerContext);
  const [dragState, setDragState] = useState(false);
  const [upstreamRecipeSelector, setUpstreamRecipeSelector] = useState(null);
  const ref = useRef();
  const renderBuildingSteps = useMemo(() => {
    if (!activeFactory) return null;
    const buildingSteps = activeFactory.buildingSteps.map(buildingStep => (
      <BuildingStep
        key={buildingStep.id}
        data={buildingStep}
        setDragState={e => setDragState(e)}
      />
    ));
    console.log("buildingSteps", buildingSteps);
    return buildingSteps;
  }, [activeFactory?.buildingSteps, scale]);

  const onDragStart = (_, __, ___, ____, e) => {
    e.stopPropagation();
  };

  const onDrop = (layout, oldItem, newItem, placeholder, event, element) => {
    if (layout.some(layoutItem => layoutItem.y === 0)) {
      // console.log("layout", layout);
      layout.forEach(layoutItem => {
        layoutItem.y += 1;
      });
    }
  };

  const onLayoutChange = layout => {
    const payload = { layout };
    const type = UPDATE_LAYOUT_PROPS;
    dispatch({ type, payload });
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
      onDragStop={onDrop}
      onDragStart={onDragStart}
      transformScale={scale}
      onLayoutChange={onLayoutChange}
      onDrag={onDrag}
      onLayoutChange={onLayoutChange}
    >
      {renderBuildingSteps}
    </GridLayout>
  );
};

export default FactoryLayout;
