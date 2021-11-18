import React, { useState, useCallback, useMemo } from "react";
import Category from "components/elements/fields/Category";
import InputEditor from "./InputEditor";
import OutsideAlerter from "utils/OutsideAlerter";
import truncateDecimals from "utils/truncateDecimals";

const BuildingStep = ({ data, functions }) => {
  const [showAutoBuild, setShowAutoBuild] = useState(false);
  const { setRecipe, setImported, autoBuildInputs, setAltOutput } = functions;
  const handleAutoBuildRecipe = useCallback(() => {
    autoBuildInputs(data);
  }, []);

  const renderItemInputs = useMemo(() => {
    // returns the small items displayed in each container - name & qty
    return data.inputs.map(input => {
      // Get outputs of building steps associated
      const totalInput = input.buildingSteps?.reduce((total, inputBuildStep) => {
        return (
          total +
          inputBuildStep.outputs.reduce((total, output) => {
            if (output.buildingStep === data) return output.qty + total;
            return total;
          }, 0)
        );
      }, 0);
      const shortfall = input.qty - totalInput;
      const className = shortfall < 0 ? "over" : shortfall > 0 ? "under" : "";
      if (shortfall > 0) setShowAutoBuild(true);
      if (shortfall <= 0) setShowAutoBuild(false);
      // Subtract this from input qty
      return (
        input && (
          <div className={`item-input ${className}`} key={input.item.itemId}>
            <p>{truncateDecimals(input.qty, 3)}</p>
            <p>{input.item.itemName}</p>
            {/* {shortfall > 0 && (
              <button onClick={handleBuildRecipe}>Auto build</button>
            )} */}
            <p>{truncateDecimals(shortfall, 3)}</p>
          </div>
        )
      );
    });
  }, [data, setImported, setRecipe]);

  const renderItemOutputs = useMemo(() => {
    return data.outputs
      .filter(output => !output.byProduct && output.buildingStep)
      .map(output => {
        return (
          <div key={output.buildingStep.id} className={"item-output"}>
            <p>{truncateDecimals(output.qty, 3)}</p>
            <p>{output.buildingStep.item.itemName}</p>
          </div>
        );
      });
  }, [data, setImported, setRecipe]);

  const renderByProducts = useMemo(() => {
    const byProducts = data.outputs.filter(output => output.byProduct);
    console.log("by products to be rendered", byProducts);
    return byProducts.map(output => (
      <div className={"item-output by-product"} key={output.item.itemId}>
        <p>{output.item.itemName}</p>
        <p>{truncateDecimals(output.qty, 4)}</p>
      </div>
    ));

    // return byProducts;
  }, [data, setImported, setRecipe]);

  const handleUpdateStore = e => {
    const options = {
      type: "store",
      qty: parseFloat(e),
      buildingStep: data,
    };
    setAltOutput(options);
  };
  const handleUpdateSink = e => {
    const options = {
      type: "sink",
      qty: parseFloat(e),
      buildingStep: data,
    };
    setAltOutput(options);
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
  }, [data, setImported, setRecipe, setAltOutput]);

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
      // <div>
      //   <label>
      //     Resourse Sink
      //     <input onKeyDown={handleUpdateSink} type="number" />
      //   </label>
      // </div>
    );
  }, [data, setImported, setRecipe]);

  const handleSetImport = () => {
    const toggle = !data.imported;
    setImported(data, toggle);
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
    const options = { recipe };
    setRecipe(data, options);
  };

  const getOutputQty = outputs => {
    const qty = outputs.reduce((total, output) => parseFloat(output.qty) + total, 0);
    return qty;
  };

  return (
    <div className={"container building-step"}>
      <h1>{data.item.itemName}</h1>

      <div className={"item-outputs"}>
        <div className="main-product">
          <h2>Main Outputs</h2>
          <div className={"main-products"}>{renderItemOutputs}</div>
        </div>
        <div className="by-product">
          <h2>By Products</h2>

          <div className={"by-products"}>{renderByProducts}</div>
        </div>
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
      <div className={"item-inputs"}>{renderItemInputs}</div>
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
