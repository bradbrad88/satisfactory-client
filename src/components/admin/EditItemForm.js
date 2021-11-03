import React, { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { Ripple } from "react-spinners-css";
import { useItemApi } from "../../hooks/useItemApi";
// import { usePutItem } from "../../hooks/usePutItem";
import Text from "./fields/Text";
import Category from "./fields/Category";
import Integer from "./fields/Integer";
import Points from "./fields/Points";
import Item from "./Item";
import DeleteButton from "../system/DeleteButton";
import "../../stylesheets/Admin.css";
import "../../stylesheets/EditItem.css";

const CATEGORY_OPTIONS = [
  { title: "ORE", id: "ore" },
  { title: "LIQUID", id: "liquid" },
  { title: "GAS", id: "gas" },
  { title: "MATERIAL", id: "material" },
  { title: "COMPONENT", id: "component" },
  { title: "FUEL", id: "fuel" },
  { title: "AMMO", id: "ammo" },
  { title: "SPECIAL", id: "special" },
  { title: "WASTE", id: "waste" },
];

const TRANSPORT_OPTIONS = [
  { title: "CONVEYOR", id: "conveyor" },
  { title: "PIPE", id: "pipe" },
];

const EditItemForm = ({
  existingItem,
  addNewItem,
  editItem,
  deleteItem,
  isDesktopOrLaptop,
  close,
}) => {
  const [itemName, setItemName] = useState({
    value: existingItem ? existingItem.itemName : "",
    error: null,
    valid: existingItem ? true : false,
  });
  const [category, setCategory] = useState({
    value: existingItem ? existingItem.category : CATEGORY_OPTIONS[0].title,
  });
  const [transportType, setTransportType] = useState({
    value: existingItem ? existingItem.transportType : TRANSPORT_OPTIONS[0].title,
  });
  const [stackSize, setStackSize] = useState({
    value: existingItem ? existingItem.stackSize : "",
    error: null,
    valid: true,
  });
  const [points, setPoints] = useState({
    value: existingItem ? existingItem.points : "",
    error: null,
    valid: existingItem ? true : false,
  });
  const [success, setSuccess] = useState(null);
  const [failure, setFailure] = useState(null);
  const { working, sendData } = useItemApi();
  const firstField = useRef();
  const timeout = useRef();

  useEffect(() => {
    return () => clearTimeout(timeout.current);
  }, []);

  const handleSubmit = async method => {
    if (!enableSubmit()) return;
    const buildingData = createApiObject();
    const { endpoint, updateFunction } = selectApiMethod(method);
    const { data, error } = await sendData(buildingData, endpoint, method);
    if (data) return handleSubmitSuccess(data, updateFunction);
    handleSubmitFail(error);
  };

  const createApiObject = () => {
    return {
      itemId: existingItem?.itemId,
      itemName: itemName.value,
      category: category.value,
      transportType: transportType.value,
      stackSize: stackSize.value,
      points: points.value,
    };
  };

  const selectApiMethod = method => {
    let updateFunction;
    let endpoint;
    switch (method) {
      case "POST":
        endpoint = "/item/new";
        updateFunction = addNewItem;
        break;
      case "PUT":
        endpoint = "/item/edit";
        updateFunction = editItem;
        break;
      case "DELETE":
        endpoint = "/item/delete";
        updateFunction = deleteItem;
        break;
      default:
        break;
    }
    return { endpoint, updateFunction };
  };

  const handleSubmitSuccess = (data, updateFunction) => {
    if (isDesktopOrLaptop) close();
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
    handleInputChange(e.target.value, setItemName, validateName);
  };

  const handleStackSizeChange = e => {
    handleInputChange(e.target.value, setStackSize, validateInteger);
  };

  const handlePointsChange = e => {
    handleInputChange(e.target.value, setPoints, validateInteger);
  };

  const handleInputChange = (value, setState, validator) => {
    const error = validator(value);
    const valid = !error;
    const newState = {
      value: value,
      error: error,
      valid: valid,
    };
    setState(newState);
  };

  // Validation functions to return FALSE on passing all tests
  // A failed test will return validation message
  const validateInteger = value => {
    let testValue = parseFloat(value);
    if (!Number.isInteger(testValue)) return "Value must be an integer";
    if (testValue < 0) return "Value must be greater than 0";
    return false;
  };

  const validateName = value => {
    if (typeof value !== "string") return "Must be alpha-numeric";
    if (value.length < 1) return "Item name can't be empty";
    return false;
  };

  const onKeyUp = e => {
    // on enter button either move to next field or on final field, submit request
    if (e.key === "Enter") {
      const inputs = Array.from(e.currentTarget.querySelectorAll("input,select"));
      const position = inputs.indexOf(e.target);
      inputs[position + 1] ? inputs[position + 1].focus() : handleSubmit();
    }
  };

  const resetFields = () => {
    setItemName({
      value: "",
      error: null,
      valid: false,
    });
    setPoints({
      value: "",
      error: null,
      valid: false,
    });
    setStackSize({
      value: "",
      error: null,
      valid: false,
    });
    firstField.current.focus();
  };

  const enableSubmit = () => {
    if (!itemName.valid) return false;
    if (!stackSize.valid) return false;
    if (!points.valid) return false;
    return true;
  };

  // A lot of conditionals as to whether this is a New Item or Update form
  // Be careful editing anything with 'item &&'
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
          ? `EDIT ${existingItem.itemName.toUpperCase()}`
          : "NEW ITEM DETAILS"}
      </h2>
      <Text
        ref={firstField}
        label={"ITEM NAME"}
        placeholder={"ITEM NAME..."}
        value={itemName.value}
        handleInputChange={handleNameChange}
        item={existingItem}
        id={"item-name"}
        error={itemName.error}
      />
      <Category
        label={"CATEGORY"}
        value={category.value}
        options={CATEGORY_OPTIONS}
        onChange={e => setCategory({ value: e.target.value })}
        item={existingItem}
        id={"item-category"}
      />
      <Category
        label={"TRANSPORT TYPE"}
        value={transportType.value}
        options={TRANSPORT_OPTIONS}
        onChange={e => setTransportType({ value: e.target.value })}
        item={existingItem}
        id={"item-transport"}
      />
      <Integer
        label={"STACK SIZE"}
        placeholder={"STACK SIZE..."}
        value={stackSize.value}
        handleInputChange={handleStackSizeChange}
        item={existingItem}
        id={"stacksize"}
        step={50}
        error={stackSize.error}
      />
      <Integer
        label={"POINTS"}
        placeholder={"RESOURCE SINK POINTS..."}
        value={points.value}
        handleInputChange={handlePointsChange}
        item={existingItem}
        id={"item-points"}
        error={points.error}
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
            "Add Item"
          )}
        </button>
      </div>
      {success && (
        <div className={"success"}>
          <span>Successfully {existingItem ? "updated" : "added"}</span>
          <Item details={success} />
        </div>
      )}
      {failure && (
        <div className={"failure"}>
          Item was unable to be {existingItem ? "updated" : "added"}
        </div>
      )}
    </div>
  );
};

export default EditItemForm;
