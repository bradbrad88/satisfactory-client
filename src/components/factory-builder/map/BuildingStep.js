import React, { useState, useLayoutEffect, useRef } from "react";
import Category from "components/elements/fields/Category";
import InputEditor from "./InputEditor";
import truncateDecimals from "utils/truncateDecimals";
import Input from "./Input";
import Output from "./Output";
import {
  AUTO_BUILD_LAYER,
  SET_ALT_OUTPUT,
  SET_IMPORTED,
  SET_RECIPE,
} from "reducers/buildingStepsReducer";

const BuildingStep = ({
  data,
  dispatch,
  updateDomPosition,
  inputDrag,
  setTempNull,
}) => {
  const [showAutoBuild] = useState(true);
  const [highlight, setHightlight] = useState(false);
  const { inputs, outputs } = data;
  const ref = useRef();
  useLayoutEffect(() => {
    updateDomPosition(ref.current, data);
  }, [data, updateDomPosition]);

  const processRecipeOptions = () => {
    return data.recipes.map(recipe => ({
      title: recipe.recipeName,
      id: recipe.recipeId,
    }));
  };

  const handleUpdateStore = e => {
    const type = SET_ALT_OUTPUT;
    const payload = {
      type: "store",
      qty: parseFloat(e),
      buildingStep: data,
    };
    dispatch({ type, payload });
  };

  const handleUpdateSink = e => {
    const type = SET_ALT_OUTPUT;
    const payload = {
      type: "sink",
      qty: parseFloat(e),
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

  const onDragOver = e => {
    try {
      const dragData = e.dataTransfer.getData("text/plain");
      const item = JSON.parse(dragData);
      // console.log("item", item.itemId);
      // console.log("step", data.item.itemId);
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
      .filter(output => !output.byProduct && output.buildingStep)
      .map(output => {
        return (
          <Output
            outputData={output}
            buildingStep={data}
            dispatch={dispatch}
            key={data.id + output.item.itemId}
          />
        );
      });
  };

  const renderByProducts = () => {
    const byProducts = outputs.filter(output => output.byProduct);
    return byProducts.map(output => <Output outputData={output} />);
  };

  const renderItemInputs = () => {
    return inputs.map(input => {
      return (
        <Input
          inputData={input}
          buildingStep={data}
          inputDrag={inputDrag}
          key={input.id}
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
    <div
      className={`container building-step ${highlight && "highlight"}`}
      ref={ref}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <h1>{data.item.itemName}</h1>
      <div className={"item-outputs"}>
        <div className="main-product">
          <h2>Main Outputs</h2>
          <div className={"main-products"}>{renderItemOutputs()}</div>
        </div>
        {renderByProducts.length > 0 && (
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
      {data.imported && !data.item.rawMaterial && (
        <button className={"build"} onClick={handleSetImport}>
          Build on site
        </button>
      )}
      {!data.imported && (
        <>
          <button className={"build"} onClick={handleSetImport}>
            Import
          </button>
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
            Requires: ({truncateDecimals(data.buildingCount, 4)}){" "}
            {data.building?.title}
          </h3>
          {showAutoBuild && (
            <button className={"build"} onClick={handleAutoBuildRecipe}>
              Auto Build
            </button>
          )}
        </>
      )}
      <div className={"item-inputs"}>{renderItemInputs()}</div>
    </div>
  );
};

export default BuildingStep;
