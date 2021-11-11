import React, { useState, useEffect } from "react";

const useData = () => {
  const [recipes, setRecipes] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_HOST}/`);
      const { data } = await res.json();
      const { recipes, items } = data;
      processItems(data);
      console.log("data", data);
      setItems(data.items);
      setRecipes(data.recipes);
    } catch (error) {
      console.log("error", error);
    }
  };

  const processItems = data => {
    const { items, recipes } = data;
    if (!items) return;
    recipes.forEach(recipe => {
      recipe.RecipeItems.filter(
        recipeItem => recipeItem.direction === "output"
      ).forEach(recipeItem => {
        const item = items.find(item => item.itemId === recipeItem.itemId);
        if (!item) return console.log("item not found", recipeItem.itemId);
        if (!item.recipes) {
          item.recipes = [recipe];
        } else {
          item.recipes.push(recipe);
          item.recipes.sort((a, b) => b.category === "standard");
        }
      });
    });
    recipes.forEach(recipe => {
      recipe.RecipeItems.forEach(recipeItem => {
        const item = items.find(item => item.itemId === recipeItem.itemId);
        recipeItem.item = item;
      });
    });
  };

  const processRecipes = data => {};

  const processBuildings = data => {};

  return { items, recipes };
};

export default useData;
