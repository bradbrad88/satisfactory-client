import React, { useState } from "react";
import Map from "./map/Map";
import UserInterface from "./ui/UserInterface";
import "stylesheets/FactoryBuilder.css";
import useFactoryBuilder from "hooks/useFactoryBuilder";

const FactoryBuilder = () => {
  const {
    factoryTotals,
    items,
    buildingSteps,
    addNewItem,
    setAltOutput,
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
    const output = {
      type: "store",
      qty,
      item: initialItem,
    };
    addNewItem(output);
  };

  const handleAutoBuild = buildingStep => {
    autoBuildInputs(buildingStep);
  };

  const uiFunctions = {
    handleAddOutput,
    handleQuantity,
    handleItem,
  };

  const mapFunctions = {
    setRecipe,
    setAltOutput,
    setImported,
    autoBuildInputs: handleAutoBuild,
  };

  return (
    <div className={"factory-builder"}>
      <button
        onClick={() => console.log("factory tree", [...buildingSteps])}
        style={{ height: "2rem", width: "7rem", position: "absolute" }}
      >
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
