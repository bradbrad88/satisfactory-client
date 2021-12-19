import React, { useState, useMemo, useContext, useRef, useCallback } from "react";
import GridLayout from "react-grid-layout";
// import BuildingRow from "./BuildingRow";
import BuildingStep from "./BuildingStep";
import RecipeSelector from "./RecipeSelector";
import { dragHandle } from "utils/SvgIcons";
import {
  INPUT_DROPPED_ON_MAP,
  BYPRODUCT_DROPPED_ON_MAP,
} from "reducers/factoryManagerReducer";
import {
  FactoryManagerContext,
  GRID_COL_WIDTH,
  GRID_ROW_HEIGHT,
} from "contexts/FactoryManagerContext";
import "../../../../node_modules/react-grid-layout/css/styles.css";
import "../../../../node_modules/react-resizable/css/styles.css";

const WIDTH = 1000;

const FactoryLayout = ({ scale }) => {
  const { activeFactory, layout } = useContext(FactoryManagerContext);
  const [dragState, setDragState] = useState(false);
  const [upstreamRecipeSelector, setUpstreamRecipeSelector] = useState(null);
  const ref = useRef();
  console.log("layout ", layout);
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
  }, [activeFactory?.buildingSteps]);

  const onDragStart = (_, __, ___, ____, m) => {
    console.log("drag start", m);
    m.stopPropagation();
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
      rowHeight={GRID_ROW_HEIGHT}
      cols={WIDTH / GRID_COL_WIDTH}
      width={WIDTH}
      resizeHandles={[]}
      layout={activeFactory?.layout}
      compactType={null}
      isDraggable={true}
      onDragStop={onDrop}
      onDragStart={onDragStart}
      transformScale={scale}
      onLayoutChange={onLayoutChange}
      onDrag={onDrag}
    >
      {renderBuildingSteps}
    </GridLayout>
  );
};

export default FactoryLayout;
