import React, { useMemo, useState } from "react";
import useApi from "../../hooks/useApi";
import useData from "hooks/useData";
import Map from "./map/Map";
import UserInterface from "./ui/UserInterface";
import "stylesheets/FactoryBuilder.css";
import BuildingStep from "utils/BuildingStep";
import useFactoryBuilder from "hooks/useFactoryBuilder";

const FactoryBuilder = () => {
  const {
    factoryTotals,
    items,
    buildingSteps,
    fullBuild,
    addNewItem,
    setRecipe,
    setImported,
    autoBuildInputs,
  } = useFactoryBuilder();
  const [initialItem, setInitialItem] = useState(null);
  const [qty, setQty] = useState(0);

  const handleQuantity = e => {
    setQty(e.target.value);
  };

  const handleItem = e => {
    const newItem = items.find(
      item => parseInt(item.itemId) === parseInt(e.target.value)
    );
    setInitialItem(newItem);
  };

  const handleAddOutput = () => {
    console.log("handling add output");
    const output = {
      type: "store",
      qty,
      item: initialItem,
    };
    addNewItem(output);
  };

  const handleAutoBuild = e => {
    console.log("buildingSteps", [...buildingSteps], e);
    autoBuildInputs(e);
  };
  // const handleNewItem = () => {
  //   const item = { ...initialItem };
  //   const arr = [...factoryTree];
  //   const output = { type: "store", item, qty };
  //   const buildingStep = new BuildingStep(item, output);
  //   buildingStep.initialiseTree(arr);
  //   setRender(arr);
  //   console.log("factory tree", arr);
  // };
  // const reRender = () => {
  //   let arr = [...factoryTree];
  //   arr = arr.filter(buildingStep => buildingStep.getTotalOutputQty() > 0);
  //   setFactoryTree(arr);
  // };

  // const setRender = arr => {
  //   arr.filter(buildingStep => buildingStep.outputs.length > 0);
  //   setFactoryTree(arr);
  // };

  // const handleRecipeChange = (buildingStep, recipe) => {
  //   const options = {
  //     recipe,
  //   };
  //   console.log("building step", buildingStep, recipe);
  //   buildingStep.setRecipe(options);
  //   reRender();
  // };

  // const buildNewRecipe = buildingStep => {
  //   const arr = [...factoryTree];
  //   buildingStep.initialiseTree(arr);
  //   reRender();
  // };

  // const autoBuildRecipe = buildingStep => {
  //   const arr = [...factoryTree];
  //   console.log("arr", arr);
  //   buildingStep.autoBuildRecipe(arr, null);
  //   setRender(arr);
  // };

  // const setImported = (buildingStep, bool) => {
  //   buildingStep.setImported(bool);
  //   // setFactoryTree([...factoryTree]);
  //   reRender();
  // };

  const uiFunctions = {
    // fullBuild,
    handleAddOutput,
    handleQuantity,
    handleItem,
  };

  const mapFunctions = {
    // fullBuild,
    setRecipe,
    setImported,
    autoBuildInputs: handleAutoBuild,
  };

  return (
    <div className={"factory-builder"}>
      <button onClick={() => console.log("factory tree", [...buildingSteps])}>
        Factory Tree
      </button>
      <UserInterface
        items={items}
        functions={uiFunctions}
        item={initialItem}
        qty={qty}
        factoryTotals={factoryTotals}
      />
      <Map data={buildingSteps} functions={mapFunctions} />
    </div>
  );
};

export default FactoryBuilder;
