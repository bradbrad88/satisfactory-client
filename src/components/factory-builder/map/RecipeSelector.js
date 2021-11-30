import React, { useCallback, useEffect } from "react";
import "stylesheets/FactoryBuilder.css";

const RecipeSelector = ({
  recipes,
  forwardingData,
  location,
  selectionHandler,
  close,
}) => {
  const clickAway = useCallback(() => {
    close();
  }, [close]);
  useEffect(() => {
    window.addEventListener("mousedown", clickAway);
    return () => window.removeEventListener("mousedown", clickAway);
  }, [clickAway]);

  const onMouseDown = e => {
    e.stopPropagation();
  };

  const onClick = e => {
    e.stopPropagation();
    const recipeId = parseInt(e.target.value);
    const recipe = recipes.find(recipe => recipe.recipeId === recipeId);
    console.log("RECIPE", recipe);
    selectionHandler(recipe, forwardingData);
    close();
  };

  const renderRecipes = () => {
    if (!recipes) return;
    return recipes.map(recipe => (
      <button
        value={recipe.recipeId}
        onClick={onClick}
        onMouseDown={onMouseDown}
        key={recipe.recipeId}
      >
        {recipe.recipeName}
      </button>
    ));
  };

  return (
    <div
      className={"recipe-selector"}
      style={{
        position: "absolute",
        left: `${location.x}px`,
        top: `${location.y}px`,
      }}
    >
      {renderRecipes()}
    </div>
  );
};

export default RecipeSelector;
