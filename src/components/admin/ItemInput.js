import React, { useState, useEffect, useRef } from "react";
// import ItemSuccess from "./ItemSuccess";
import Item from "./Item";
import "../../stylesheets/Admin.css";

const ItemInput = ({ addNewItem }) => {
  const [itemName, setItemName] = useState({
    value: "",
    error: null,
    valid: false,
  });
  const [category, setCategory] = useState({
    value: "ore",
  });
  const [stackSize, setStackSize] = useState({
    value: "100",
    error: null,
    valid: true,
  });
  const [points, setPoints] = useState({
    value: "",
    error: null,
    valid: false,
  });
  const [posting, setPosting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const itemField = useRef();
  useEffect(() => {
    setFailure(false);
  }, [itemName, category, stackSize, points]);

  const postItem = async () => {
    if (!enableSubmit()) return;
    const itemData = JSON.stringify({
      itemName: itemName.value,
      category: category.value,
      stackSize: stackSize.value,
      points: points.value,
    });
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: itemData,
    };

    try {
      setPosting(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/item/new`,
        options
      );

      const { data, error } = await response.json();

      if (error) {
        console.log("error in try", error);
        setFailure(error);
      }

      if (response.status === 201) {
        // have a think about this
        setSuccess(data);
        setTimeout(() => {
          setSuccess(false);
        }, 2000);
        setPosting(false);
        resetFields();
        addNewItem(data);
      } else {
        setFailure(true);
      }
    } catch (error) {
      console.log("error in catch", error);
      setFailure(error);
      setPosting(false);
    }
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

  const enableSubmit = () => {
    if (!itemName.valid) return false;
    if (!stackSize.valid) return false;
    if (!points.valid) return false;
    return true;
  };

  const onKeyUp = e => {
    if (e.key === "Enter") {
      const inputs = Array.from(e.currentTarget.querySelectorAll("input,select"));
      const position = inputs.indexOf(e.target);
      inputs[position + 1] ? inputs[position + 1].focus() : postItem();
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

  return (
    <div className={"container"}>
      <div className={"form"} onKeyUp={onKeyUp}>
        <h2>ITEM DETAILS</h2>
        <div className="field">
          <label for={"itemName"}>ITEM</label>
          <input
            autoFocus
            type={"text"}
            placeholder={"ITEM NAME..."}
            onChange={e => handleChange(e.target.value, setItemName, validateName)}
            value={itemName.value}
            onBlur={e => handleChange(e.target.value, setItemName, validateName)}
            id={"itemName"}
            enterKeyHint={"next"}
            ref={itemField}
          />
          {itemName.error && <p>{itemName.error}</p>}
        </div>
        <div className="field">
          <label for={"category"}>CATEGORY</label>
          <select
            value={category.value}
            onChange={e => setCategory({ value: e.target.value })}
            id={"category"}
          >
            <option value={"ore"}>ore</option>
            <option value={"liquid"}>liquid</option>
            <option value={"gas"}>gas</option>
            <option value={"material"}>material</option>
            <option value={"component"}>component</option>
            <option value={"fuel"}>fuel</option>
            <option value={"ammo"}>ammo</option>
            <option value={"special"}>special</option>
            <option value={"waste"}>waste</option>
          </select>
        </div>
        <div className="field">
          <label for={"stackSize"}>STACK SIZE</label>
          <input
            type={"number"}
            step={50}
            placeholder={"STACK SIZE..."}
            onChange={e =>
              handleChange(e.target.value, setStackSize, validateInteger)
            }
            onBlur={e => handleChange(e.target.value, setStackSize, validateInteger)}
            value={stackSize.value}
            id={"stackSize"}
          />
          {stackSize.error && <p>{stackSize.error}</p>}
        </div>
        <div className="field">
          <label for={"points"}>POINTS</label>
          <input
            type={"number"}
            placeholder={"RESOURCE SINK POINT VALUE..."}
            onChange={e => handleChange(e.target.value, setPoints, validateInteger)}
            onBlur={e => handleChange(e.target.value, setPoints, validateInteger)}
            value={points.value}
            id={"points"}
          />
          {points.error && <p>{points.error}</p>}
        </div>
        <div className="field">
          <button onClick={postItem} disabled={!enableSubmit()}>
            Submit
          </button>
        </div>
        {/* <Item
          details={{
            category: "liquid",
            createdAt: "2021-09-18T21:51:51.222Z",
            itemId: 23,
            itemName: "Alumina Solution",
            points: 20,
            stackSize: 0,
            updatedAt: "2021-09-18T21:51:51.222Z",
          }}
        /> */}
        {success && (
          <div className={"success"}>
            <span>Successfully added</span>
            <Item details={success} />
          </div>
        )}
        {failure && <div className={"failure"}>Failure!!!!</div>}
      </div>
    </div>
  );
};

export default ItemInput;
