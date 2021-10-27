import React, { useState, useRef } from "react";

import { useItemApi } from "../../hooks/useItemApi";
import Text from "./fields/Text";
import Integer from "./fields/Integer";
import Category from "./fields/Category";
import BuildingInputs from "./BuildingInputs";
import DeleteButton from "../system/DeleteButton";
import Item from "./Item";

const CATEGORY_OPTIONS = [
  { title: "extractors", id: 1 },
  { title: "production", id: 2 },
  { title: "generators", id: 3 },
];

const formatInputsObject = (inputs, direction) => {
  if (!inputs) return;
  return inputs
    .filter(input => input.direction === direction)
    .reduce((obj, input) => {
      obj[input.type] = input.amount;
      return obj;
    }, {});
};

const EditBuildingForm = ({
  building,
  addNewItem,
  editItem,
  deleteItem,
  close,
  isDesktopOrLaptop,
}) => {
  const [name, setName] = useState({
    value: building ? building.title : "",
    error: null,
    valid: building ? true : false,
  });
  const [power, setPower] = useState({
    value: building ? building.power : 0,
    error: null,
    valid: building ? true : false,
  });
  const [category, setCategory] = useState({
    value: building ? building.category : CATEGORY_OPTIONS[0].title,
  });
  const [inputs, setInputs] = useState(
    building
      ? formatInputsObject(building.BuildingInputs, "input")
      : { pipe: 0, conveyor: 0 }
  );
  const [outputs, setOutputs] = useState(
    building
      ? formatInputsObject(building.BuildingInputs, "output")
      : { pipe: 0, conveyor: 0 }
  );
  const [res, setRes] = useState(null);
  const { sendData } = useItemApi();
  const firstField = useRef();
  const timeout = useRef();

  const enableSubmit = () => {
    if (!name.valid) return false;
    if (!power.valid) return false;
    return true;
  };

  const handleSubmit = async method => {
    if (!enableSubmit()) return;
    const buildingData = createBuildingObject();
    const { endpoint, updateFunction } = selectApiMethod(method);
    const result = await sendData(buildingData, endpoint, method);
    setRes(result);
    console.log("result", result);
    if (result.data) updateFunction(result.data);
    if (method === "DELETE") return;
    if (!isDesktopOrLaptop) close();
    resetFields();
    timeout.current = setTimeout(() => {
      setRes(null);
    }, 1500);
  };

  const selectApiMethod = method => {
    let updateFunction;
    let endpoint;
    switch (method) {
      case "POST":
        endpoint = "/building/new";
        updateFunction = addNewItem;
        break;
      case "PUT":
        endpoint = "/building/edit";
        updateFunction = editItem;
        break;
      case "DELETE":
        endpoint = "/building/delete";
        updateFunction = deleteItem;
      default:
        break;
    }
    return { endpoint, updateFunction };
  };

  const createBuildingObject = () => {
    return {
      buildingId: building?.buildingId,
      title: name.value,
      category: category.value,
      power: power.value,
      BuildingInputs: [
        { direction: "input", amount: inputs.pipe || 0, type: "pipe" },
        { direction: "input", amount: inputs.conveyor || 0, type: "conveyor" },
        { direction: "output", amount: outputs.pipe || 0, type: "pipe" },
        { direction: "output", amount: outputs.conveyor || 0, type: "conveyor" },
      ],
    };
  };

  const handleNameChange = e => {
    handleChange(e.target.value, setName, validateName);
  };

  const handlePowerChange = e => {
    handleChange(e.target.value, setPower, validatePower);
  };

  const handleInputsChange = (direction, newState) => {
    switch (direction) {
      case "input":
        return setInputs(newState);
      case "output":
        return setOutputs(newState);

      default:
        break;
    }
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

  const validateName = value => {
    if (typeof value !== "string") return "Must be alpha-numeric";
    if (value.length < 1) return "Building name can not be empty";
    return false;
  };

  const validatePower = value => {
    let testValue = Number(value);
    if (!Number.isInteger(testValue)) return "Value must be an integer";
    return false;
  };

  const onKeyUp = e => {
    if (e.key === "Enter") {
      const inputs = Array.from(e.currentTarget.querySelectorAll("input,select"));
      const position = inputs.indexOf(e.target);
      inputs[position + 1]
        ? inputs[position + 1].focus()
        : handleSubmit(building ? "PUT" : "POST");
    }
  };

  const resetFields = () => {
    setName({
      value: "",
      error: null,
      valid: false,
    });
    setPower({
      value: 0,
      error: null,
      valid: false,
    });
    setCategory({
      value: CATEGORY_OPTIONS[0],
    });
    firstField.current?.focus();
  };

  const handleDelete = () => {
    handleSubmit("DELETE");
  };

  return (
    <div className={"form building"} onKeyUp={onKeyUp}>
      {(!isDesktopOrLaptop || building) && (
        <button className={"close"} onClick={close}>
          X
        </button>
      )}
      {building && (
        <DeleteButton
          className={"delete"}
          handleDelete={() => handleSubmit("DELETE")}
        />
      )}
      <h2>{building ? `Edit ${building.title}` : "New Building"}</h2>
      <Text
        ref={firstField}
        handleInputChange={handleNameChange}
        value={name.value}
        label={"BUILDING NAME"}
        placeholder={"BUILDING NAME..."}
        error={name.error}
      />
      <Integer
        handleInputChange={handlePowerChange}
        value={power.value}
        placeholder={"POWER..."}
        label={"POWER"}
        id={"power"}
        error={power.error}
      />
      <Category
        options={CATEGORY_OPTIONS}
        onChange={e => setCategory({ value: e.target.value })}
        value={category.value}
      />
      <div className={"building-inputs"}>
        <BuildingInputs
          pipe={inputs.pipe}
          conveyor={inputs.conveyor}
          type={"input"}
          handleChange={handleInputsChange}
        />
        <BuildingInputs
          pipe={outputs.pipe}
          conveyor={outputs.conveyor}
          type={"output"}
          handleChange={handleInputsChange}
        />
      </div>
      <div className="field">
        <button onClick={() => handleSubmit(building ? "PUT" : "POST")}>
          {building ? "Apply Changes" : "Add Building"}
        </button>
      </div>
      {res?.data && (
        <div className="success">
          <span>Successfully {building ? "updated" : "added"}</span>
          <Item details={res.data} />
        </div>
      )}
    </div>
  );
};

export default EditBuildingForm;
