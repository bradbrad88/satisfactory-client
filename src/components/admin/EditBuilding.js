import React, { useState } from "react";

import { useItemApi } from "../../hooks/useItemApi";
import Text from "./fields/Text";
import Integer from "./fields/Integer";
import Category from "./fields/Category";
import BuildingInputs from "./BuildingInputs";

const CATEGORY_OPTIONS = ["extractors", "production", "generators"];

const EditBuilding = ({ building }) => {
  const [name, setName] = useState("");
  const [power, setPower] = useState(0);
  const [category, setCategory] = useState("");
  const [inputs, setInputs] = useState({ pipes: 0, conveyors: 0 });
  const [outputs, setOutputs] = useState({ pipes: 0, conveyors: 0 });
  const { working, sendData } = useItemApi();

  const handleSubmit = async () => {
    const buildingData = createBuildingObject();
    const endpoint = building ? "/building/edit" : "/building/new";
    const method = building ? "PUT" : "POST";
    const result = await sendData(buildingData, endpoint, method);
  };

  const createBuildingObject = () => {
    return {
      buildingId: building?.buildingId,
      title: name.value,
      category,
      power: power.value,
      BuildingInputs: [
        { direction: "input", amount: inputs.pipes, type: "pipe" },
        { direction: "input", amount: inputs.conveyors, type: "conveyor" },
        { direction: "output", amount: outputs.pipes, type: "pipe" },
        { direction: "output", amount: outputs.conveyors, type: "conveyor" },
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
      case "inputs":
        return setInputs(newState);
      case "outputs":
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
          pipes={inputs.pipes}
          conveyors={inputs.conveyors}
          type={"inputs"}
          handleChange={handleInputsChange}
        />
        <BuildingInputs
          pipes={outputs.pipes}
          conveyors={outputs.conveyors}
          type={"outputs"}
          handleChange={handleInputsChange}
        />
      </div>
      <div className="field">
        <button onClick={handleSubmit}>Add Building</button>
      </div>
    </div>
  );
};

export default EditBuilding;
