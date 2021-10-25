import React, { useState } from "react";

import { useItemApi } from "../../hooks/useItemApi";
import Text from "./fields/Text";
import Integer from "./fields/Integer";
import Category from "./fields/Category";
import BuildingInputs from "./BuildingInputs";

const CATEGORY_OPTIONS = [
  { title: "extractors", id: 1 },
  { title: "production", id: 2 },
  { title: "generators", id: 3 },
];
const formatInputsObject = (inputs, direction) => {
  if (!inputs) return;
  // console.log("inputs", inputs);
  return inputs
    .filter(input => input.direction === direction)
    .reduce((obj, input) => {
      obj[input.type] = input.amount;
      return obj;
    }, {});
};
const EditBuildingForm = ({ building }) => {
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
    value: building ? building.category : "",
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
  const { sendData } = useItemApi();
  // console.log(formatInputsObject(building?.BuildingInputs, "input"));
  const handleSubmit = async e => {
    e.stopPropagation();
    const buildingData = createBuildingObject();
    const endpoint = building ? "/building/edit" : "/building/new";
    const method = building ? "PUT" : "POST";
    const result = await sendData(buildingData, endpoint, method);
    console.log("result", result);
  };

  const createBuildingObject = () => {
    return {
      buildingId: building?.buildingId,
      title: name.value,
      category,
      power: power.value,
      BuildingInputs: [
        { direction: "input", amount: inputs.pipe, type: "pipe" },
        { direction: "input", amount: inputs.conveyor, type: "conveyor" },
        { direction: "output", amount: outputs.pipe, type: "pipe" },
        { direction: "output", amount: outputs.conveyor, type: "conveyor" },
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

  const validateName = () => {};

  const validatePower = () => {};

  return (
    <div className={"form building"}>
      <h2>Edit Building</h2>
      <Text
        handleInputChange={handleNameChange}
        value={name.value}
        label={"BUILDING NAME"}
        placeholder={"BUILDING NAME..."}
      />
      <Integer
        handleInputChange={handlePowerChange}
        value={power.value}
        placeholder={"POWER..."}
        label={"POWER"}
        id={"power"}
      />
      <Category
        options={CATEGORY_OPTIONS}
        onChange={e => setCategory(e.target.value)}
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
        <button onClick={handleSubmit}>Add Building</button>
      </div>
    </div>
  );
};

export default EditBuildingForm;
