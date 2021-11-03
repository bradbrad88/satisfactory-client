import React, { useState, useRef, useMemo } from "react";
import { Ripple } from "react-spinners-css";
import { useItemApi } from "../../hooks/useItemApi";
import Text from "./fields/Text";
import Integer from "./fields/Integer";
import Category from "./fields/Category";
import Building from "./fields/Building";
import RecipeItemFrame from "./RecipeItemFrame";
import DeleteButton from "../system/DeleteButton";
import Item from "./Item";
import { useEffect } from "react/cjs/react.development";
import useApi from "../../hooks/useApi";

const CATEGORY_OPTIONS = [
  { title: "STANDARD RECIPE", id: "standard" },
  { title: "ALTERNATE RECIPE", id: "alt recipe" },
];

const EditRecipeForm = ({
  existingItem,
  addNewItem,
  editItem,
  deleteItem,
  close,
  isDesktopOrLaptop,
}) => {
  const [name, setName] = useState({
    value: existingItem ? existingItem.recipeName : "",
    error: null,
    valid: existingItem ? true : false,
  });
  const [category, setCategory] = useState({
    value: existingItem ? existingItem.category : CATEGORY_OPTIONS[0].id,
  });
  const [building, setBuilding] = useState({
    value: existingItem ? existingItem.building : "",
  });
  const [recipeItems, setRecipeItems] = useState({
    value: existingItem ? existingItem.RecipeItems : [],
  });
  const [success, setSuccess] = useState(null);
  const [failure, setFailure] = useState(null);
  const { sendData, working } = useItemApi();
  const { items: buildings, working: buildingsWorking } = useApi("buildings");
  const firstField = useRef();
  const timeout = useRef();

  const currentBuilding = useMemo(() => {
    const currentBuilding = buildings.find(
      ({ buildingId }) => parseInt(buildingId) === parseInt(building.value)
    );
    return currentBuilding;
  }, [building, buildings]);

  useEffect(() => {
    return () => clearTimeout(timeout.current);
  });

  const handleSubmit = async method => {
    if (!enableSubmit()) return;
    const recipeData = createApiObject();
    const { endpoint, updateFunction } = selectApiMethod(method);
    const { data, error } = await sendData(recipeData, endpoint, method);
    if (data) return handleSubmitSuccess(data, updateFunction);
    handleSubmitFail(error);
  };

  const createApiObject = () => {
    return {
      recipeId: existingItem?.recipeId,
      recipeName: name.value,
      category: category.value,
      building: building.value,
      RecipeItems: recipeItems.value,
    };
  };

  const selectApiMethod = method => {
    let updateFunction;
    let endpoint;
    switch (method) {
      case "POST":
        endpoint = "/recipe/new";
        updateFunction = addNewItem;
        break;
      case "PUT":
        endpoint = "/recipe/edit";
        updateFunction = editItem;
        break;
      case "DELETE":
        endpoint = "/recipe/delete";
        updateFunction = deleteItem;
      default:
        break;
    }
    return { endpoint, updateFunction };
  };

  const handleSubmitSuccess = (data, updateFunction) => {
    setSuccess(data);
    updateFunction(data);
    resetFields();
    timeout.current = setTimeout(() => {
      if (!isDesktopOrLaptop) close();
      setSuccess(null);
    }, 1500);
  };

  const handleSubmitFail = error => {
    setFailure(error);
    timeout.current = setTimeout(() => {
      setFailure(null);
    }, 1500);
  };

  const handleNameChange = e => {
    handleChange(e.target.value, setName, validateName);
  };

  const handleBuildingChange = e => {
    setBuilding({ value: e.target.value });
  };

  const handleRecipeItemsChange = recipeItems => {
    console.log("edit recipe form", recipeItems);
    recipeItems.forEach(item => {
      if (!item.type) item.type = item.Item?.transportType;
    });

    setRecipeItems({ value: recipeItems });
  };

  const handleChange = (value, setState, validator) => {
    const error = validator(value);
    const valid = !error;
    const newState = {
      value: value,
      error: error,
      valid: valid,
    };
    setState(newState);
  };

  // const getBuilding = id => {
  //   const building = buildings.find(
  //     ({ buildingId }) => parseInt(buildingId) === parseInt(id)
  //   );
  //   return building;
  // };

  const validateName = value => {
    if (typeof value !== "string") return "Must be alpha-numeric";
    if (value.length < 1) return "Building name can not be empty";
    return false;
  };

  const onKeyUp = e => {
    if (e.key === "Enter") {
      const inputs = Array.from(e.currentTarget.querySelectorAll("input,select"));
      const position = inputs.indexOf(e.target);
      inputs[position + 1]
        ? inputs[position + 1].focus()
        : handleSubmit(existingItem ? "PUT" : "POST");
    }
  };

  // TODO
  const resetFields = () => {
    setName({
      value: "",
      error: null,
      valid: false,
    });
    setCategory({
      value: CATEGORY_OPTIONS[0],
    });
    firstField.current?.focus();
  };

  // TODO
  const enableSubmit = () => {
    if (!name.valid) return false;
    return true;
  };

  return (
    <div className={"form"} onKeyUp={onKeyUp}>
      {(!isDesktopOrLaptop || existingItem) && (
        <button className={"close"} onClick={close}>
          X
        </button>
      )}
      {existingItem && (
        <DeleteButton
          className={"delete"}
          handleDelete={() => handleSubmit("DELETE")}
        />
      )}
      <h2>
        {existingItem
          ? `EDIT ${existingItem.recipeName.toUpperCase()}`
          : "NEW RECIPE DETAILS"}
      </h2>

      <Text
        label={"RECIPE NAME"}
        placeholder={"RECIPE NAME..."}
        handleInputChange={handleNameChange}
        value={name.value}
        ref={firstField}
      />
      <Category
        label={"CATEGORY"}
        value={category.value}
        options={CATEGORY_OPTIONS}
        onChange={e => setCategory({ value: e.target.value })}
        item={existingItem}
        id={"recipe-category"}
      />
      <Building
        value={building.value}
        onChange={handleBuildingChange}
        items={buildings}
      />
      <RecipeItemFrame
        // buildingInputs={getBuilding(building.value)}
        building={currentBuilding}
        input={currentBuilding?.input || []}
        output={currentBuilding?.output || []}
        value={recipeItems.value}
        onChange={handleRecipeItemsChange}
      />

      <div className="field">
        <button
          onClick={() => handleSubmit(existingItem ? "PUT" : "POST")}
          disabled={!enableSubmit()}
        >
          {working ? (
            <Ripple color={"#000"} size={30} />
          ) : existingItem ? (
            "Submit Changes"
          ) : (
            "Add Recipe"
          )}
        </button>
      </div>
      {success && (
        <div className="success">
          <span>Successfully {existingItem ? "updated" : "added"}</span>
          <Item details={success} />
        </div>
      )}
      {failure && (
        <div className="failure">
          Recipe was unable to be {existingItem ? "updated" : "added"}
        </div>
      )}
    </div>
  );
};

export default EditRecipeForm;
