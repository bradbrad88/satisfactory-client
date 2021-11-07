import React, { useState, useRef } from "react";
import { Ripple } from "react-spinners-css";
import { useItemApi } from "../../hooks/useItemApi";
import Text from "../elements/fields/Text";
import NumberInput from "../elements/fields/NumberInput";
import Category from "../elements/fields/Category";
import BuildingInputs from "./BuildingInputs";
import DeleteButton from "../system/DeleteButton";
import Item from "./Item";
import { useEffect } from "react/cjs/react.development";

const CATEGORY_OPTIONS = [
  { title: "EXTRACTORS", id: "extractors" },
  { title: "PRODUCTION", id: "production" },
  { title: "GENERATORS", id: "generators" },
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
  existingItem,
  addNewItem,
  editItem,
  deleteItem,
  close,
  isDesktopOrLaptop,
}) => {
  const [name, setName] = useState({
    value: existingItem ? existingItem.title : "",
    error: null,
    valid: existingItem ? true : false,
  });
  const [power, setPower] = useState({
    value: existingItem ? existingItem.power : "",
    error: null,
    valid: existingItem ? true : false,
  });
  const [category, setCategory] = useState({
    value: existingItem ? existingItem.category : CATEGORY_OPTIONS[0].title,
  });
  const [inputs, setInputs] = useState(
    existingItem
      ? formatInputsObject(existingItem.BuildingInputs, "input")
      : { pipe: 0, conveyor: 0 }
  );
  const [outputs, setOutputs] = useState(
    existingItem
      ? formatInputsObject(existingItem.BuildingInputs, "output")
      : { pipe: 0, conveyor: 0 }
  );
  const [success, setSuccess] = useState(null);
  const [failure, setFailure] = useState(null);
  const { sendData, working } = useItemApi();
  const firstField = useRef();
  const timeout = useRef();

  useEffect(() => {
    return () => clearTimeout(timeout.current);
  });

  const handleSubmit = async method => {
    if (!enableSubmit()) return;
    const buildingData = createApiObject();
    const { endpoint, updateFunction } = selectApiMethod(method);
    const { data, error } = await sendData(buildingData, endpoint, method);
    if (data) return handleSubmitSuccess(data, updateFunction);
    handleSubmitFail(error);
  };

  function toTitleCase(str) {
    return str.replace(/\b\w+/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  // TODO reduce BuildingInputs array to not include 0 amounts
  const createApiObject = () => {
    return {
      buildingId: existingItem?.buildingId,
      title: toTitleCase(name.value),
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
        break;
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
    let testValue = parseFloat(value);
    if (!Number.isInteger(testValue)) return "Value must be an integer";
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
    setInputs({
      pipe: 0,
      conveyor: 0,
    });
    setOutputs({
      pipe: 0,
      conveyor: 0,
    });
    firstField.current?.focus();
  };

  const enableSubmit = () => {
    if (!name.valid) return false;
    if (!power.valid) return false;
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
          ? `EDIT ${existingItem.title.toUpperCase()}`
          : "NEW BUILDING DETAILS"}
      </h2>
      <Text
        ref={firstField}
        label={"BUILDING NAME"}
        placeholder={"BUILDING NAME..."}
        value={name.value}
        handleInputChange={handleNameChange}
        item={existingItem}
        id={"building-name"}
        error={name.error}
      />
      <NumberInput
        label={"POWER"}
        placeholder={"POWER..."}
        value={power.value}
        handleInputChange={handlePowerChange}
        item={existingItem}
        id={"power"}
        error={power.error}
      />
      <Category
        label={"CATEGORY"}
        value={category.value}
        options={CATEGORY_OPTIONS}
        onChange={e => setCategory({ value: e.target.value })}
        item={existingItem}
        id={"item-category"}
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
        <button
          onClick={() => handleSubmit(existingItem ? "PUT" : "POST")}
          disabled={!enableSubmit()}
        >
          {working ? (
            <Ripple color={"#000"} size={30} />
          ) : existingItem ? (
            "Submit Changes"
          ) : (
            "Add Building"
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
          Building was unable to be {existingItem ? "updated" : "added"}
        </div>
      )}
    </div>
  );
};

export default EditBuildingForm;
