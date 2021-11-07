import React, { useState } from "react";
import useApi from "../../hooks/useApi";
import Map from "./map/Map";
import UserInterface from "./ui/UserInterface";
import "stylesheets/FactoryBuilder.css";

const FactoryBuilder = () => {
  const [factoryTree, setFactoryTree] = useState(null);
  const [initialItem, setInitialItem] = useState(null);
  const [qty, setQty] = useState(0);
  const { items } = useApi("items", "itemId", 0);
  const { items: recipes } = useApi("recipes", "recipeId", 0);
  const { items: buildings } = useApi("buildings", "buildingId", 0);

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

  const getBuilding = id => {
    const { buildingId, title, power } = buildings.find(
      building => parseInt(building.buildingId) === parseInt(id)
    );
    return { buildingId, title, power };
  };

  const getByProducts = (item, recipeItems) => {
    const byProducts = recipeItems.filter(
      recipeItem =>
        parseInt(recipeItem.itemId) !== parseInt(item.itemId) &&
        recipeItem.direction === "output"
    );
    return byProducts;
  };

  const createBuildingStep = (item, qty) => {
    const recipes = getItemRecipes(item);
    if (recipes.length < 1) return;
    const recipe = recipes[0];
    const building = getBuilding(recipe.building);
    const recipeInput = getRecipeInputByItem(item, recipe.RecipeItems);
    const buildingCount = qty / recipeInput.qty;
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
