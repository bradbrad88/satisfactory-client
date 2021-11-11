import React, { useState } from "react";
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

  const handleQuantity = e => {
    setQty(e.target.value);
  };

  const handleItem = e => {
    const newItem = items.find(
      item => parseInt(item.itemId) === parseInt(e.target.value)
    );
    setInitialItem(newItem);
  };

  const handleNewRecipe = () => {
    const item = { ...initialItem };
    const arr = [];
    const buildingStep = new BuildingStep(item);
    buildingStep.addOutput({ type: "store", item, qty });
    buildingStep.initialiseStandardTree(arr);
    setFactoryTree(arr);
    console.log("building steps", arr);
  };

  const createBuildStepArray = (buildingStep, arr) => {
    buildingStep.inputs.forEach(input => {
      console.log("running build step array function");
      createBuildStepArray(input.buildingStep, arr);
    });
    const existingItem = arr.find(el => {
      console.log("el", el);
      return el.item === buildingStep.item;
    });
    if (existingItem) {
      existingItem.addOutput(buildingStep);
    } else {
      arr.push(buildingStep);
    }
  };

  // const getRecipeInputs = (recipe, buildingCount) => {
  //   const recipeInputs = recipe.RecipeItems.filter(
  //     recipeItem => recipeItem.direction === "input"
  //   ).map(recipeItem => {
  //     const item = items.find(item => item.itemId === recipeItem.itemId);

  //     const qty = buildingCount * recipeItem.qty;
  //     console.log("get recipe inputs", recipe, item);
  //     const buildingStep = createBuildingStep(item, qty);
  //     return { ...buildingStep, qty, item };
  //   });
  //   return recipeInputs;
  // };

  // const getRecipeInputQty = (item, recipeInputs) => {
  //   const recipeInput = recipeInputs.find(
  //     recipeInput => parseInt(recipeInput.itemId) === parseInt(item.itemId)
  //   );
  //   if (!recipeInput)
  //     return console.error(
  //       "Error trying to find recipe input quantity in FactoryBuilder.js - getRecipeInputQty function line 52"
  //     );
  //   return recipeInput.qty;
  // };

  // const getByProducts = (item, recipeItems) => {
  //   const byProducts = recipeItems.filter(
  //     recipeItem =>
  //       parseInt(recipeItem.itemId) !== parseInt(item.itemId) &&
  //       recipeItem.direction === "output"
  //   );
  //   return byProducts;
  // };

  const createBuildingStep = (item, qty) => {
    // const { recipes } = item;
    // if (!recipes) return;
    // if (recipes.length < 1) return;
    // const recipe = recipes[0];
    // const { building } = recipe;
    // const recipeInputQty = getRecipeInputQty(item, recipe.RecipeItems);
    // console.log("recipe input qty", recipeInputQty);
    // // const recipeInput =
    // const buildingCount = qty / recipeInputQty;
    // const power = buildingCount * building.power;
    // const inputs = getRecipeInputs(recipe, buildingCount);
    // const byProducts = getByProducts(item, recipe.RecipeItems);
    // return {
    //   item,
    //   qty,
    //   recipe,
    //   recipes,
    //   building,
    //   buildingCount,
    //   power,
    //   inputs,
    //   byProducts,
    // };
  };

  return (
    <div className={"factory-builder"}>
      <UserInterface
        items={items}
        handleQuantity={handleQuantity}
        handleItem={handleItem}
        item={initialItem}
        qty={qty}
        newRecipe={handleNewRecipe}
      />
      <Map data={factoryTree} />
    </div>
  );
};

export default FactoryBuilder;
