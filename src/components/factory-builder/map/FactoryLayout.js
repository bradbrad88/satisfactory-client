import React, { useState, useMemo, useContext } from "react";
import BuildingRow from "./BuildingRow";
import RecipeSelector from "./RecipeSelector";
import {
  INPUT_DROPPED_ON_MAP,
  BYPRODUCT_DROPPED_ON_MAP,
} from "reducers/buildingStepsReducer";
import { FactoryManagerContext } from "contexts/FactoryManagerContext";

const FactoryLayout = ({ data, recipes, dispatch }) => {
  const { activeFactory } = useContext(FactoryManagerContext);
  const [tempItem, setTempItem] = useState(null);
  const [tempPosition, setTempPosition] = useState(0);
  const [upstreamRecipeSelector, setUpstreamRecipeSelector] = useState(null);
  const [activeItem] = useState(null);

  const setTempNull = () => {
    setTempItem(null);
  };

  const buildingRows = useMemo(() => {
    if (!activeFactory) return null;
    const buildingRows = activeFactory.reduce((total, buildingStep) => {
      const arr = total[buildingStep.ver] || [];
      arr.push(buildingStep);
      total[buildingStep.ver] = arr;
      return total;
    }, {});
    Object.keys(buildingRows).forEach(key => {
      buildingRows[key].sort((a, b) => a.hor - b.hor);
    });

    const renderBuildingRows = Object.keys(buildingRows).map(key => (
      <BuildingRow
        data={buildingRows[key]}
        recipes={recipes}
        key={key}
        dispatch={dispatch}
        tempStep={tempItem?.row === parseInt(key) ? tempItem : null}
        setTempPosition={i => setTempPosition(i)}
        setTempNull={setTempNull}
      />
    ));
    if (tempItem && !buildingRows[tempItem.row]) {
      renderBuildingRows.push(
        <BuildingRow
          tempStep={tempItem}
          data={[]}
          setTempPosition={i => setTempPosition(i)}
        />
      );
    }
    return renderBuildingRows;
  }, [activeFactory, dispatch, tempItem, recipes]);

  const onDragOver = e => {
    e.preventDefault();
    // console.log("e", e);
    try {
      const dragData = e.dataTransfer.getData("text/plain");
      const item = JSON.parse(dragData);
      if (item.fromInput)
        setTempItem({ ...item, position: { x: e.clientX, y: e.clientY } });
    } catch (error) {
      setTempItem(null);
    }
  };

  const onDrop = e => {
    e.preventDefault();
    try {
      const dragData = e.dataTransfer.getData("text/plain");
      const parsedData = JSON.parse(dragData);
      if (parsedData.fromInput) {
        e.stopPropagation();
        handleInputDrop(parsedData);
      }
      if (parsedData.fromByProduct) {
        const { clientX, clientY } = e;
        const { offsetLeft, offsetTop } = e.target;
        handleByProductDrop(parsedData, {
          x: clientX - offsetLeft,
          y: clientY - offsetTop,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputDrop = inputData => {
    const type = INPUT_DROPPED_ON_MAP;
    const payload = {
      inputData,
    };
    dispatch({ type, payload });
    setTempItem(null);
  };

  const handleByProductDrop = (byProductData, location) => {
    const { itemId, buildingStepId } = byProductData;
    const relevantRecipes = recipes.filter(recipe => {
      const recipeItems = recipe.RecipeItems.filter(recipeItem => {
        return (
          recipeItem.direction === "input" &&
          recipeItem.item.itemId === parseInt(byProductData.itemId)
        );
      });
      return recipeItems.length > 0;
    });
    console.log("by product data", byProductData);
    // byProductRef.current = { buildingStepId, itemId };
    setUpstreamRecipeSelector({
      recipes: relevantRecipes,
      location,
      byProductData,
    });
  };

  const handleByProductUpstream = (recipe, byProduct) => {
    // console.log("handler", things);
    const type = BYPRODUCT_DROPPED_ON_MAP;
    const payload = {
      // ...byProductRef.current,
      ...byProduct,
      recipe,
    };
    dispatch({ type, payload });
  };

  return (
    <div className={"factory-layout"}>
      {upstreamRecipeSelector && (
        <RecipeSelector
          recipes={upstreamRecipeSelector.recipes}
          forwardingData={upstreamRecipeSelector.byProductData}
          location={upstreamRecipeSelector.location}
          selectionHandler={handleByProductUpstream}
          close={() => setUpstreamRecipeSelector(null)}
        />
      )}

      {/* <div
        className={"grid"}
        // style={style()}

        // onMouseUp={onMouseUp}
      > */}
      {buildingRows}
      {/* </div> */}
    </div>
  );
};

export default FactoryLayout;
