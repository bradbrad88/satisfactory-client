import React, { useState } from "react";
import useApi from "../../hooks/useApi";
import useData from "hooks/useData";
import Map from "./map/Map";
import UserInterface from "./ui/UserInterface";
import "stylesheets/FactoryBuilder.css";

const FactoryBuilder = () => {
  const [factoryTree, setFactoryTree] = useState(null);
  const [initialItem, setInitialItem] = useState(null);
  const [qty, setQty] = useState(0);
  // const { items } = useApi("items", "itemId", 0);
  // const { items: recipes } = useApi("recipes", "recipeId", 0);
  // const { items: buildings } = useApi("buildings", "buildingId", 0);
  const { items, recipes } = useData();
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
    // Find a list of recipes that outputs a particular item
    const item = { ...initialItem };
    const buildingStep = createBuildingStep(item, qty);
    setFactoryTree(buildingStep);
  };

  //
  const getItemRecipes = item => {
    const itemRecipes = recipes
      .reduce((total, recipe) => {
        if (
          recipe.RecipeItems.some(
            recipeItem =>
              recipeItem.direction === "output" &&
              parseInt(recipeItem.itemId) === parseInt(item.itemId)
          )
        ) {
          const arr = [...total, recipe];
          return arr;
        }
        return total;
      }, [])
      .sort((a, b) => b.category === "standard");
    return itemRecipes;
  };

  const getRecipeInputs = (recipe, buildingCount) => {
    const recipeInputs = recipe.RecipeItems.filter(
      recipeItem => recipeItem.direction === "input"
    ).map(recipeItem => {
      const item = items.find(item => item.itemId === recipeItem.itemId);

      const qty = buildingCount * recipeItem.qty;
      console.log("get recipe inputs", recipe, item);
      const buildingStep = createBuildingStep(item, qty);
      return { ...buildingStep, qty, item };
    });
    return recipeInputs;
  };

  const getRecipeInputByItem = (item, recipeInputs) => {
    return recipeInputs.find(
      recipeInput => parseInt(recipeInput.itemId) === parseInt(item.itemId)
    );
  };

  const getRecipeInputQty = (item, recipeInputs) => {
    const recipeInput = recipeInputs.find(
      recipeInput => parseInt(recipeInput.itemId) === parseInt(item.itemId)
    );
    if (!recipeInput)
      return console.error(
        "Error trying to find recipe input quantity in FactoryBuilder.js - getRecipeInputQty function line 72"
      );
    return recipeInput.qty;
  };

  // const getBuilding = id => {
  //   const { buildingId, title, power } = buildings.find(
  //     building => parseInt(building.buildingId) === parseInt(id)
  //   );
  //   return { buildingId, title, power };
  // };

  const getByProducts = (item, recipeItems) => {
    const byProducts = recipeItems.filter(
      recipeItem =>
        parseInt(recipeItem.itemId) !== parseInt(item.itemId) &&
        recipeItem.direction === "output"
    );
    return byProducts;
  };

  const createBuildingStep = (item, qty) => {
    const { recipes } = item;
    if (!recipes) return;
    if (recipes.length < 1) return;
    const recipe = recipes[0];
    const { building } = recipe;
    const recipeInputQty = getRecipeInputQty(item, recipe.RecipeItems);
    console.log("recipe input qty", recipeInputQty);
    // const recipeInput =
    const buildingCount = qty / recipeInputQty;
    const power = buildingCount * building.power;
    const inputs = getRecipeInputs(recipe, buildingCount);
    const byProducts = getByProducts(item, recipe.RecipeItems);

    return {
      item,
      qty,
      recipe,
      recipes,
      building,
      buildingCount,
      power,
      inputs,
      byProducts,
    };
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
