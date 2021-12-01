import React, { useState, useLayoutEffect, useRef } from "react";
import Category from "components/elements/fields/Category";
import InputEditor from "./InputEditor";
import truncateDecimals from "utils/truncateDecimals";
import RecipeSelector from "./RecipeSelector";
import Input from "./Input";
import Output from "./Output";
import ByProduct from "./ByProduct";
import { newStep } from "utils/SvgIcons";
import {
  ADD_ITEM_UPSTREAM,
  AUTO_BUILD_LAYER,
  SET_ALT_OUTPUT,
  SET_IMPORTED,
  SET_RECIPE,
  INPUT_DROPPED_ON_BUILDINGSTEP,
} from "reducers/buildingStepsReducer";

const BuildingStep = ({
  data,
  recipes,
  dispatch,
  updateDomPosition,
  inputDrag,
  setTempNull,
}) => {
  const [recipeSelector, setRecipeSelector] = useState(null);
  // const [showAutoBuild] = useState(true);
  const [highlight, setHightlight] = useState(false);
  const { inputs, outputs } = data;
  const ref = useRef();

  useLayoutEffect(() => {
    updateDomPosition(ref.current, data);
  }, [data, updateDomPosition]);

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
    console.log("recipe id", recipe);
    // const recipe = recipes.find(recipe => recipe.recipeId === recipeId);
    const payload = { buildingStep: data, recipe };
    const type = ADD_ITEM_UPSTREAM;
    dispatch({ type, payload });
  };

  const preventPropagation = e => {
    e.stopPropagation();
  };

  const onRecipeChange = e => {
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
    console.log("inputData", inputData);
    if (inputData.itemId !== data.item.itemId) {
      return;
    }
    e.stopPropagation();
    const type = INPUT_DROPPED_ON_BUILDINGSTEP;
    const payload = { inputData, buildingStep: data };
    dispatch({ type, payload });
  };

  const onDragOver = e => {
    try {
      const dragData = e.dataTransfer.getData("text/plain");
      const item = JSON.parse(dragData);
      if (item.itemId === data.item.itemId) {
        e.stopPropagation();
        e.preventDefault();
        setHightlight(true);
        setTempNull();
      }
      if (inputs.some(input => item.inputId === input.id)) {
        e.stopPropagation();
        setTempNull();
      }
    } catch (error) {
      console.log("drag-over data unusable");
    }
  };

  const onDragLeave = e => {
    setHightlight(false);
  };

  const renderItemOutputs = () => {
    return outputs
      .filter(output => !output.byProduct && output.input)
      .map(output => {
        return (
          <Output
            outputData={output}
            dispatch={dispatch}
            key={data.id + output.id}
            setTempNull={setTempNull}
          />
        );
      });
  };

  const renderByProducts = () => {
    const byProducts = outputs.filter(output => output.byProduct);
    return byProducts.map(output => (
      <ByProduct
        byProductData={output}
        dispatch={dispatch}
        key={output.id}
        setTempNull={setTempNull}
      />
    ));
  };

  const renderItemInputs = () => {
    return inputs.map(input => {
      return (
        <Input
          inputData={input}
          inputDrag={inputDrag}
          key={input.id}
          setTempNull={setTempNull}
          dispatch={dispatch}
        />
      );
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

  return (
    <>
      <div
        className={`container building-step ${highlight && "highlight"}`}
        ref={ref}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="title cell">
          <h1>{data.item.itemName}</h1>
          {!data.imported && (
            <button className={"build"} onClick={handleSetImport}>
              Import
            </button>
          )}
          {data.imported && !data.item.rawMaterial && (
            <button className={"build"} onClick={handleSetImport}>
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
            {renderStoreOutput()}
            {renderSinkOutput()}
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
      {/* Recipe Selector handles the recipes that can be continued on from the output */}
      {recipeSelector && (
        <RecipeSelector
          recipes={recipeSelector.recipes}
          location={recipeSelector.location}
          selectionHandler={recipeSelectionHandler}
          close={() => setRecipeSelector(null)}
        />
      )}
    </>
  );
};

export default BuildingStep;
