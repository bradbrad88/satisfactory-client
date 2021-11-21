import React, { useState, useCallback, useMemo } from "react";
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

const BuildingStep = ({ data, functions, dispatch }) => {
  const [showAutoBuild, setShowAutoBuild] = useState(true);
  // const { setRecipe, setImported, autoBuildInputs, setAltOutput } = functions;

  const { inputs, outputs } = data;

  const renderItemOutputs = () => {
    return outputs
      .filter(output => !output.byProduct && output.buildingStep)
      .map(output => {
        return (
          <div key={output.buildingStep.id} className={"item-output"}>
            <p>{truncateDecimals(output.qty, 3)}</p>
            <p>{output.buildingStep.item.itemName}</p>
          </div>
        );
      });
  };
  const renderByProducts = () => {
    const byProducts = outputs.filter(output => output.byProduct);
    return byProducts.map(output => <Output outputData={output} />);

    // return byProducts;
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
  const renderStoreOutput = useMemo(() => {
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
  }, [data, handleUpdateStore]);

  const renderSinkOutput = useMemo(() => {
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
  }, [data, handleUpdateSink]);

  const renderItemInputs = () => {
    // returns the small items displayed in each container - name & qty

    return inputs.map(input => {
      return <Input inputData={input} key={input.id} />;
    });
  };

  const handleSetImport = () => {
    const payload = { toggle: !data.imported, buildingStep: data };
    const type = SET_IMPORTED;
    dispatch({ type, payload });
    // setImported(data, toggle);
  };

  const processRecipeOptions = () => {
    return data.recipes.map(recipe => ({
      title: recipe.recipeName,
      id: recipe.recipeId,
    }));
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
    // setRecipe(data, options);
  };

  // const getOutputQty = outputs => {
  //   const qty = outputs.reduce((total, output) => parseFloat(output.qty) + total, 0);
  //   return qty;
  // };

  return (
    <div className={"container building-step"}>
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
      {renderStoreOutput}
      {renderSinkOutput}
      {/* <h2>
        ({truncateDecimals(getOutputQty(data.outputs), 3)}) {data.item.itemName}
      </h2> */}
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

  // const renderInputs = () => {
  //   // returns a new generation by recursion
  //   return data.inputs.map(
  //     input => input?.building && <BuildingStep data={input} />
  //   );
  // };

  // return (
  //   <div className={"generation"}>
  //     <div className={"container building-step"} style={{ display: "block" }}>
  //       <h2>
  //         ({data.qty}) {data.item?.itemName}
  //       </h2>
  //       <h3>
  //         Recipe:{" "}
  //         {data.recipe.category === "standard" ? "Standard" : data.recipe.recipeName}
  //       </h3>
  // <h3>
  //   Requires: ({data.buildingCount}) {data.building.title}
  // </h3>
  //   <div className={"item-inputs"}>{renderItemInputs()}</div>
  // </div>
  // <div className={"inputs"}>{renderInputs()}</div>
  //   </div>
  // );
};

export default BuildingStep;
