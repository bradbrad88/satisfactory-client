import React, { useState, useMemo, useContext, useRef, useCallback } from "react";
import BuildingRow from "./BuildingRow";
import BuildingStep from "./BuildingStep";
import RecipeSelector from "./RecipeSelector";
import {
  INPUT_DROPPED_ON_MAP,
  BYPRODUCT_DROPPED_ON_MAP,
} from "reducers/factoryManagerReducer";
import { FactoryManagerContext } from "contexts/FactoryManagerContext";

const FactoryLayout = () => {
  const { activeFactory, recipes, dispatch, factories } =
    useContext(FactoryManagerContext);
  const layout = activeFactory?.layout;
  const [widthController, setWidthController] = useState({
    buildingStep: null,
    width: 0,
  });
  const [upstreamRecipeSelector, setUpstreamRecipeSelector] = useState(null);
  const ref = useRef();

  const widthHandler = useCallback(
    (buildingStep, x, width) => {
      const testWidth = Math.abs(x) + width / 2;
      if (widthController.buildingStep === buildingStep) {
        setWidthController({ buildingStep, width: testWidth });
        return;
      }

      if (testWidth > widthController.width) {
        setWidthController({ buildingStep, width: testWidth });
      }
    },
    [widthController.buildingStep, widthController.width]
  );

  const renderBuildingSteps = useMemo(() => {
    if (!layout) return <p>SELECT A FACTORY TO BEGIN</p>;
    const buildingRows = Object.keys(layout).map(key => {
      return (
        <BuildingRow
          gridRow={layout[key]}
          key={key}
          row={key}
          width={widthController.width}
          widthHandler={widthHandler}
        />
      );
    });
    buildingRows.unshift(
      <BuildingRow key={"top"} row={"top"} width={widthController.width} />
    );
    buildingRows.push(
      <BuildingRow key={"bottom"} row={"bottom"} width={widthController.width} />
    );
    return buildingRows;
  }, [factories, layout, widthController.width, widthHandler]);

  // const onDragOver = e => {
  //   e.preventDefault();
  //   // console.log("e", e);
  //   try {
  //     const dragData = e.dataTransfer.getData("text/plain");
  //     const item = JSON.parse(dragData);
  //     if (item.fromInput)
  //       setTempItem({ ...item, position: { x: e.clientX, y: e.clientY } });
  //   } catch (error) {
  //     setTempItem(null);
  //   }
  // };

  // const onDrop = e => {
  //   e.preventDefault();
  //   try {
  //     const dragData = e.dataTransfer.getData("text/plain");
  //     const parsedData = JSON.parse(dragData);
  //     if (parsedData.fromInput) {
  //       e.stopPropagation();
  //       handleInputDrop(parsedData);
  //     }
  //     if (parsedData.fromByProduct) {
  //       const { clientX, clientY } = e;
  //       const { offsetLeft, offsetTop } = e.target;
  //       handleByProductDrop(parsedData, {
  //         x: clientX - offsetLeft,
  //         y: clientY - offsetTop,
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const handleInputDrop = inputData => {
  //   // const type = INPUT_DROPPED_ON_MAP;
  //   const payload = {
  //     inputData,
  //   };
  //   // dispatch({ type, payload });
  //   setTempItem(null);
  // };

  // const handleByProductDrop = (byProductData, location) => {
  //   const { itemId, buildingStepId } = byProductData;
  //   const relevantRecipes = recipes.filter(recipe => {
  //     const recipeItems = recipe.RecipeItems.filter(recipeItem => {
  //       return (
  //         recipeItem.direction === "input" &&
  //         recipeItem.item.itemId === parseInt(byProductData.itemId)
  //       );
  //     });
  //     return recipeItems.length > 0;
  //   });
  //   setUpstreamRecipeSelector({
  //     recipes: relevantRecipes,
  //     location,
  //     byProductData,
  //   });
  // };

  // const handleByProductUpstream = (recipe, byProduct) => {
  //   const type = BYPRODUCT_DROPPED_ON_MAP;
  //   const payload = {
  //     ...byProduct,
  //     recipe,
  //   };
  //   dispatch({ type, payload });
  // };

  return (
    <div
      ref={ref}
      className={"factory-layout"}
      // onDrop={onDrop}
      // onDragOver={onDragOver}
    >
      {upstreamRecipeSelector && (
        <RecipeSelector
          recipes={upstreamRecipeSelector.recipes}
          forwardingData={upstreamRecipeSelector.byProductData}
          location={upstreamRecipeSelector.location}
          // selectionHandler={handleByProductUpstream}
          close={() => setUpstreamRecipeSelector(null)}
        />
      )}
      {renderBuildingSteps}
    </div>
  );
};

export default FactoryLayout;
