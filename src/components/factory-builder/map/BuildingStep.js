import React, { useState, useRef, useContext, useLayoutEffect } from "react";
import Category from "components/elements/fields/Category";
import InputEditor from "./InputEditor";
import truncateDecimals from "utils/truncateDecimals";
import RecipeSelector from "./RecipeSelector";
import Input from "./Input";
import Output from "./Output";
import ByProduct from "./ByProduct";
import { dragHandle, newStep } from "utils/SvgIcons";
import {
  ADD_ITEM_UPSTREAM,
  AUTO_BUILD_LAYER,
  SET_ALT_OUTPUT,
  SET_IMPORTED,
  SET_RECIPE,
  INPUT_DROPPED_ON_BUILDINGSTEP,
  SET_BUILDING_STEP_WIDTH,
} from "reducers/factoryManagerReducer";
import {
  FactoryManagerContext,
  GRID_COL_WIDTH,
} from "contexts/FactoryManagerContext";

const BuildingStep = (
  { style, className, data, setDragState, handleDragOver, setDroppable, ...props },
  ref
) => {
  const { dispatch, recipes, layout } = useContext(FactoryManagerContext);
  const [recipeSelector, setRecipeSelector] = useState(null);
  const [highlight, setHightlight] = useState(false);
  // const [displayLeft, setDisplayLeft] = useState(0);
  const { inputs, outputs } = data;
  // const ref = useRef();
  useLayoutEffect(() => {
    if (!ref.current) return;
    const w = Math.ceil(ref.current.clientWidth / GRID_COL_WIDTH);
    const layoutItem = layout.find(layoutItem => layoutItem.i === data.id);
    // console.log("w", w);
    // console.log("client width", ref.current.clientWidth);
    // console.log("existing w", layoutItem.w);
    if (layoutItem.w === w) return;
    const type = SET_BUILDING_STEP_WIDTH;
    const payload = { w, buildingStep: data };
    dispatch({ type, payload });
  }, [data, dispatch, ref]);

  const suppliedInputQty = input => {
    return input.outputs.reduce((total, output) => {
      return output.qty + total;
    }, 0);
  };

  const shortfall = () => {
    const shortfall = inputs.reduce((total, input) => {
      const qty = input.qty - suppliedInputQty(input);
      if (qty !== 0) return true;
      return total;
    }, false);
    return shortfall;
  };

  const processRecipeOptions = () => {
    return data.recipes.map(recipe => ({
      title: recipe.recipeName,
      id: recipe.recipeId,
    }));
  };

  const handleUpdateStore = e => {
    const type = SET_ALT_OUTPUT;
    const payload = {
      output: {
        type: "store",
        qty: parseFloat(e),
      },
      buildingStep: data,
    };
    dispatch({ type, payload });
  };

  const handleUpdateSink = e => {
    const type = SET_ALT_OUTPUT;
    const payload = {
      output: {
        type: "sink",
        qty: parseFloat(e),
      },
      buildingStep: data,
    };
    dispatch({ type, payload });
  };

  const handleAutoBuildRecipe = () => {
    const type = AUTO_BUILD_LAYER;
    const payload = { buildingStep: data };
    dispatch({ type, payload });
  };

  const handleSetImport = () => {
    const payload = { toggle: !data.imported, buildingStep: data };
    const type = SET_IMPORTED;
    dispatch({ type, payload });
  };

  const handleNewPotentialStep = () => {
    const relevantRecipes = recipes.filter(recipe => {
      const recipeItems = recipe.RecipeItems.filter(recipeItem => {
        return (
          recipeItem.direction === "input" &&
          recipeItem.item.itemId === data.item.itemId
        );
      });
      return recipeItems.length > 0;
    });
    const { offsetWidth, offsetLeft } = ref.current;
    const x = offsetLeft + offsetWidth;
    setRecipeSelector({
      location: { x },
      recipes: relevantRecipes,
    });
  };

  const recipeSelectionHandler = recipe => {
    const payload = { buildingStep: data, recipe };
    const type = ADD_ITEM_UPSTREAM;
    dispatch({ type, payload });
  };

  const preventPropagation = e => {
    e.stopPropagation();
  };

  const onRecipeChange = e => {
    console.log("e", e.target.value);
    const recipe = data.recipes.find(
      r => parseInt(r.recipeId) === parseInt(e.target.value)
    );
    const type = SET_RECIPE;
    const payload = { options: { recipe }, buildingStep: data };
    dispatch({ type, payload });
  };

  const onDrop = e => {
    setHightlight(false);
    try {
      const dragData = e.dataTransfer.getData("text/plain");
      const parsedItem = JSON.parse(dragData);
      if (parsedItem.fromInput) handleInputDrop(parsedItem, e);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputDrop = (inputData, e) => {
    if (inputData.itemId !== data.item.itemId) {
      return;
    }
    e.stopPropagation();
    const type = INPUT_DROPPED_ON_BUILDINGSTEP;
    const payload = { inputData, buildingStep: data };
    dispatch({ type, payload });
  };

  const onDragOver = e => {
    console.log("dragging over");
    // // handleDragOver();
    // setDroppable(false);
    // return;
    // try {
    //   const dragData = e.dataTransfer.getData("text/plain");
    //   const item = JSON.parse(dragData);
    //   if (item.itemId === data.item.itemId) {
    //     e.stopPropagation();
    //     e.preventDefault();
    //     setHightlight(true);
    //   }
    //   if (inputs.some(input => item.inputId === input.id)) {
    //     e.stopPropagation();
    //   }
    // } catch (error) {
    //   console.log("drag-over data unusable");
    // }
  };

  const onDragLeave = () => {
    setDroppable(true);
  };

  const renderItemOutputs = () => {
    return outputs
      .filter(output => !output.byProduct)
      .map(output => {
        return <Output outputData={output} key={data.id + output.id} />;
      });
  };

  const renderByProducts = () => {
    const byProducts = outputs.filter(output => output.byProduct);
    return byProducts.map(output => (
      <ByProduct byProductData={output} key={output.id} />
    ));
  };

  const renderItemInputs = () => {
    return inputs.map(input => {
      return <Input inputData={input} key={input.id} />;
    });
  };

  const renderStoreOutput = () => {
    const storeValue = data.outputs.reduce((total, output) => {
      if (output.type !== "store") return total;
      return parseFloat(output.qty) + total;
    }, 0);
    return (
      <InputEditor
        className={"alt-outputs"}
        value={storeValue}
        label={"Store"}
        handleChange={handleUpdateStore}
        id={`store-${data.id}`}
      />
    );
  };

  const renderSinkOutput = () => {
    const sinkValue = data.outputs.reduce((total, output) => {
      if (output.type !== "sink") return total;
      return parseFloat(output.qty) + total;
    }, 0);
    return (
      <InputEditor
        className={"alt-outputs"}
        value={sinkValue}
        label={"Sink"}
        handleChange={handleUpdateSink}
        id={`sink-${data.id}`}
      />
    );
  };

  const onMouseEnter = () => {
    console.log("mouse enter");
    setDragState(true);
  };

  const onMouseLeave = () => {
    setDragState(false);
  };

  return (
    <div
      className={`${className} container building-step ${highlight && "highlight"}`}
      ref={ref}
      key={data.id}
      style={style}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      {...props}
    >
      <div className="title cell">
        <h1>{data.item.itemName}</h1>
        {!data.imported && (
          <button
            className={"build"}
            onClick={handleSetImport}
            onMouseDown={e => e.stopPropagation()}
          >
            Import
          </button>
        )}
        {data.imported && !data.item.rawMaterial && (
          <button
            className={"build"}
            onClick={handleSetImport}
            onMouseDown={e => e.stopPropagation()}
          >
            Build on site
          </button>
        )}
        <button className={"new-step"} onClick={handleNewPotentialStep}>
          {newStep(30)}
        </button>
      </div>
      <div className="output cell">
        <div className={"item-outputs"}>
          <div className="main-product">
            <h2>Outputs</h2>
            <div className={"main-products"}>{renderItemOutputs()}</div>
          </div>
          {renderByProducts().length > 0 && (
            <div className="by-product">
              <h2>By Products</h2>

              <div className={"by-products"}>{renderByProducts()}</div>
            </div>
          )}
        </div>
        <div className={"alt-outputs"}>
          {/* {renderStoreOutput()}
          {renderSinkOutput()} */}
        </div>
      </div>
      <div className="recipe cell">
        {!data.imported && (
          <>
            <h3>
              Recipe:{" "}
              {data.recipe?.category === "standard"
                ? "Standard"
                : data.recipe?.recipeName}
            </h3>
            <div onMouseDown={preventPropagation}>
              <Category
                options={processRecipeOptions()}
                onChange={onRecipeChange}
                value={data.recipe?.recipeId || ""}
              />
            </div>
            <h3>
              Requires: ({truncateDecimals(data.buildingCount, 4)})
              {data.building?.title}
            </h3>
          </>
        )}
      </div>
      {!data.imported && (
        <div className="input cell">
          <h2>Inputs</h2>
          {shortfall() && (
            <button className={"build"} onClick={handleAutoBuildRecipe}>
              Auto Build
            </button>
          )}
          <div className={"item-inputs"}>{renderItemInputs()}</div>
        </div>
      )}
    </div>
  );
};

export default React.forwardRef(BuildingStep);
