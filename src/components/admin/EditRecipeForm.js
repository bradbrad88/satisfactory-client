import React, { useState } from "react";
import Text from "./fields/Text";
import Category from "./fields/Category";
import Building from "./fields/Building";
import RecipeItems from "./RecipeItems";

const CATEGORY_OPTIONS = ["standard", "alt recipe"];

const EditRecipeForm = ({ item }) => {
  const [name, setName] = useState({
    value: item ? item.recipeName : "",
    error: null,
    valid: item ? true : false,
  });
  const [category, setCategory] = useState({
    value: item ? item.category : CATEGORY_OPTIONS[0],
  });
  const [building, setBuilding] = useState(null);
  const handleNameChange = e => {
    handleNameChange(e.target.value, setName, validateName);
  };

  const handleChange = (value, setState, validator) => {
    const error = validator(value);
    const valid = !error;
    const newState = {
      value,
      error,
      valid,
    };
    setState(newState);
  };

  const validateName = () => {};
  return (
    <div className={"form recipe"}>
      <h2>Edit Recipe</h2>
      <Text
        handleInputChange={handleNameChange}
        value={name.value}
        label={"RECIPE NAME"}
        placeholder={"RECIPE NAME..."}
      />
      <Category
        options={CATEGORY_OPTIONS}
        value={category.value}
        onChange={e => setCategory({ value: e.target.value })}
      />
      <Building />
      <RecipeItems />
    </div>
  );
};

export default EditRecipeForm;
