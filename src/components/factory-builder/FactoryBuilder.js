import React, { useMemo, useState } from "react";
import useApi from "../../hooks/useApi";
import useData from "hooks/useData";
import Map from "./map/Map";
import UserInterface from "./ui/UserInterface";
import "stylesheets/FactoryBuilder.css";
import BuildingStep from "utils/BuildingStep";

const FactoryBuilder = () => {
  const { items } = useData();
  const [factoryTree, setFactoryTree] = useState([]);
  const [initialItem, setInitialItem] = useState(null);
  const [qty, setQty] = useState(0);
  console.log("factory tree state on render", factoryTree);
  const factoryTotals = useMemo(() => {
    const breakdown = factoryTree.reduce(
      (total, buildingStep) => {
        const newTotal = { ...total };
        const outputs = buildingStep.outputs.reduce((outputTotal, output) => {
          const { item, qty, type } = output;
          const newTotal = { ...outputTotal };
          const arr = newTotal[type] || [];
          // TODO - look for existing item here and add to it
          arr.push({ item, qty });
          newTotal[type] = arr;
          return newTotal;
        }, {});

        if (buildingStep.item.rawMaterial) {
          newTotal.inputs.rawMaterials = newTotal.inputs.rawMaterials || [];
          newTotal.inputs.rawMaterials.push({
            item: buildingStep.item,
            qty: buildingStep.getTotalOutputQty(),
          });
        } else if (buildingStep.imported) {
          newTotal.inputs.imported = newTotal.inputs.imported || [];
          newTotal.inputs.imported.push({
            item: buildingStep.item,
            qty: buildingStep.getTotalOutputQty(),
          });
        } else {
        }

        // see if newwTotal.ouputs already exists

        Object.keys(outputs).forEach(key => {
          const arr = outputs[key] || [];
          const existingArr = newTotal.outputs[key] || [];
          newTotal.outputs[key] = [...existingArr, ...arr];
        });

        // newTotal.outputs = outputs;

        return newTotal;
      },
      { inputs: {}, outputs: {} }
    );
    return breakdown;
  }, [factoryTree]);
  console.log("factory tree", factoryTree);
  const handleQuantity = e => {
    setQty(e.target.value);
  };

  const handleItem = e => {
    const newItem = items.find(
      item => parseInt(item.itemId) === parseInt(e.target.value)
    );
    setInitialItem(newItem);
  };

  const handleNewItem = () => {
    const item = { ...initialItem };
    const arr = [...factoryTree];
    const output = { type: "store", item, qty };
    const buildingStep = new BuildingStep(item, output);
    buildingStep.initialiseTree(arr);
    setRender(arr);
    console.log("factory tree", arr);
  };
  const reRender = () => {
    let arr = [...factoryTree];
    arr = arr.filter(buildingStep => buildingStep.getTotalOutputQty() > 0);
    setFactoryTree(arr);
  };

  const setRender = arr => {
    arr.filter(buildingStep => buildingStep.outputs.length > 0);
    setFactoryTree(arr);
  };

  const handleRecipeChange = (buildingStep, recipe) => {
    const options = {
      recipe,
    };
    console.log("building step", buildingStep, recipe);
    buildingStep.setRecipe(options);
    reRender();
  };

  const buildNewRecipe = buildingStep => {
    const arr = [...factoryTree];
    buildingStep.initialiseTree(arr);
    reRender();
  };

  const autoBuildRecipe = buildingStep => {
    const arr = [...factoryTree];
    console.log("arr", arr);
    buildingStep.autoBuildRecipe(arr, null);
    setRender(arr);
  };

  const setImported = (buildingStep, bool) => {
    buildingStep.setImported(bool);
    // setFactoryTree([...factoryTree]);
    reRender();
  };

  const functions = {
    handleNewItem,
    handleRecipeChange,
    // buildNewRecipe,
    setImported,
    autoBuildRecipe,
  };

  return (
    <div className={"factory-builder"}>
      <button onClick={() => console.log("factory tree", [...factoryTree])}>
        Factory Tree
      </button>
      <UserInterface
        items={items}
        handleQuantity={handleQuantity}
        handleItem={handleItem}
        item={initialItem}
        qty={qty}
        factoryTotals={factoryTotals}
        functions={functions}
      />
      <Map data={factoryTree} functions={functions} />
    </div>
  );
};

export default FactoryBuilder;
