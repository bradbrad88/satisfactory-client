import React, { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { Ripple } from "react-spinners-css";
import { useItemApi } from "../../hooks/useItemApi";
// import { usePutItem } from "../../hooks/usePutItem";
import Select from "../elements/Select";
import Text from "./fields/Text";
import Category from "./fields/Category";
import Integer from "./fields/Integer";
import Points from "./fields/Points";
import Item from "./Item";
import DeleteButton from "../system/DeleteButton";
import "../../stylesheets/Admin.css";
import "../../stylesheets/EditItem.css";

const ItemInput = ({ item, addNewItem, editItem, deleteItem, className, close }) => {
  const [itemName, setItemName] = useState({
    value: item ? item.itemName : "",
    error: null,
    valid: item ? true : false,
  });
  const [category, setCategory] = useState({
    value: item ? item.category : "ore",
  });
  const [stackSize, setStackSize] = useState({
    value: item ? item.stackSize : "100",
    error: null,
    valid: true,
  });
  const [points, setPoints] = useState({
    value: item ? item.points : "",
    error: null,
    valid: item ? true : false,
  });
  // const [error, setError] = useState(null)
  const [response, setResponse] = useState(null);
  const { working, sendData } = useItemApi();
  const itemField = useRef();
  const containerRef = useRef();
  const timeoutRef = useRef();
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1224px)" });
  useEffect(() => {
    // console.log("form ref", formRef.current);
    containerRef.current.scrollTop = 0;
    return () => clearTimeout(timeoutRef.current);
  }, []);
  // useEffect(() => {}, [itemName, category, stackSize, points]);

  const itemData = () => {
    return {
      itemId: item?.itemId,
      itemName: itemName.value,
      category: category.value,
      stackSize: stackSize.value,
      points: points.value,
    };
  };

  const sendItem = async method => {
    if (!enableSubmit()) return;
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
        updateFunction = handleDeleteItem;
        break;
      default:
        break;
    }
    const res = await sendData(itemData(), endpoint, method);
    setResponse(res);
    if (res.data) updateFunction(res.data);
  };

  const enableSubmit = () => {
    if (!itemName.valid) return false;
    if (!stackSize.valid) return false;
    if (!points.valid) return false;
    return true;
  };

  const handleSubmit = async () => {
    if (!enableSubmit()) return;
    await sendItem(item ? "PUT" : "POST");
    if (close) close();
    resetFields();
    timeoutRef.current = setTimeout(() => {
      setResponse(null);
    }, 1500);
  };
  const handleDeleteItem = async () => {
    deleteItem(item.itemId);
  };

  // Validation functions to return FALSE on passing all tests
  // A failed test will return validation message
  const validateInteger = value => {
    let testValue = Number(value);
    if (!Number.isInteger(testValue)) return "Value must be an integer";
    if (testValue < 0) return "Value must be greater than 0";
    return false;
  };

  const validateName = value => {
    if (typeof value !== "string") return "Must be alpha-numeric";
    if (value.length < 1) return "Item name can't be empty";
    return false;
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
    itemField.current.focus();
  };

  // if (data && close) close();

  // A lot of conditionals as to whether this is a New Item or Update form
  // Be careful editing anything with 'item &&'
  return (
    // Stopping propagation here to so that Close() function won't run when clicking on the edit version of the form
    <div
      ref={containerRef}
      className={`container ${className && className}`}
      onClick={e => item && e.stopPropagation()}
    >
      <div className={"form"} onKeyUp={onKeyUp}>
        {(!isDesktopOrLaptop || item) && (
          <button className={"close"} onClick={close}>
            X
          </button>
        )}
        {item && (
          <DeleteButton
            className={"delete"}
            handleDelete={() => sendItem("DELETE")}
          />
        )}
        <h2>{item ? item.itemName : "NEW ITEM DETAILS"}</h2>
        <Text
          ref={itemField}
          item={item}
          value={itemName.value}
          error={itemName.error}
          handleInputChange={handleNameChange}
        />
        <Category
          item={item}
          value={category.value}
          onChange={e => setCategory({ value: e.target.value })}
        />
        <Integer
          item={item}
          value={stackSize.value}
          error={stackSize.error}
          handleInputChange={handleStackSizeChange}
          placeholder={"STACK SIZE..."}
          id={"stacksize"}
          step={50}
        />
        <Points
          item={item}
          value={points.value}
          error={points.error}
          handleInputChange={handlePointsChange}
        />
        <div className="field">
          <button onClick={handleSubmit} disabled={!enableSubmit()}>
            {working ? (
              <Ripple color={"#000"} size={30} />
            ) : item ? (
              "Submit Changes"
            ) : (
              "Add Item"
            )}
          </button>
        </div>
        {response?.data && (
          <div className={"success"}>
            <span>Successfully {item ? "updated" : "added"}</span>
            <Item details={response.data} />
          </div>
        )}
        {response?.error && (
          <div className={"failure"}>Item was unable to be updated</div>
        )}
      </div>
    </div>
  );
};

export default ItemInput;
