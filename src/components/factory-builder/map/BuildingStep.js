import React, { useState, useCallback, useMemo } from "react";
import Category from "components/elements/fields/Category";
import truncateDecimals from "utils/truncateDecimals";

const BuildingStep = ({ data, functions }) => {
  const [showAutoBuild, setShowAutoBuild] = useState(false);
  const { handleRecipeChange, setImported, autoBuildRecipe } = functions;
  const handleAutoBuildRecipe = useCallback(() => {
    // debugger;
    autoBuildRecipe(data);
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
            <p>{shortfall}</p>
          </div>
        )
      );
    });
  }, [autoBuildRecipe]);

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
    handleRecipeChange(data, recipe);
  };

  return (
    <div className={"container building-step"}>
      <h2>
        ({truncateDecimals(data.getTotalOutputQty(), 3)}) {data.item.itemName}
      </h2>
      {data.imported && !data.item.rawMaterial && (
        <button onClick={handleSetImport}>Build on site</button>
      )}
      {!data.imported && (
        <>
          <button onClick={handleSetImport}>Import</button>
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
          {showAutoBuild && (
            <button onClick={handleAutoBuildRecipe}>Auto Build</button>
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
