import React from "react";
import pipeImage from "../../assets/pipe.webp";
import conveyorImage from "../../assets/conveyor.webp";

const BuildingInputs = ({ pipe, conveyor, type, handleChange }) => {
  const editPipe = (input, e) => {
    console.log("input", input);
    e.stopPropagation();
    let newPipes = (pipe || 0) + input;
    if (newPipes > 6) newPipes = pipe;
    const newState = { pipe: newPipes, conveyor };
    handleChange(type, newState);
  };

  const editConveyor = (input, e) => {
    e.stopPropagation();
    let newConveyors = (conveyor || 0) + input;
    if (newConveyors > 6) newConveyors = conveyor;
    const newState = { pipe, conveyor: newConveyors };
    handleChange(type, newState);
  };

  const renderPipes = () => {
    const pipeElements = [];
    for (let i = 0; i < pipe; i++) {
      pipeElements.push(
        <button onClick={e => editPipe(-1, e)} title={`Remove pipe ${type}`}>
          <img alt={"remove pipe input"} src={pipeImage} style={{ width: "50px" }} />
        </button>
      );
    }
    return pipeElements;
  };
  const renderConveyors = () => {
    const conveyorElements = [];
    for (let i = 0; i < conveyor; i++) {
      conveyorElements.push(
        <button onClick={e => editConveyor(-1, e)} title={`Remove conveyor ${type}`}>
          <img
            alt={"remove conveyor input"}
            src={conveyorImage}
            style={{ width: "50px" }}
          />
        </button>
      );
    }
    return conveyorElements;
  };
  return (
    <div className={"building-inputs-type"}>
      <div className={"building-inputs-header"}>
        <span className={"building-inputs-title"}>{type + "S"}</span>
        <div className={"add"}>
          <button onClick={e => editConveyor(1, e)} title={`Add pipe ${type}`}>
            <img
              alt={"add conveyor input"}
              src={conveyorImage}
              style={{ width: "30px" }}
            />
          </button>
          <button onClick={e => editPipe(1, e)} title={`Add pipe ${type}`}>
            <img alt={"add pipe input"} src={pipeImage} style={{ width: "30px" }} />
          </button>
        </div>
      </div>
      <div className={"building-inputs-detail"}>
        {renderConveyors()}
        {renderPipes()}
      </div>
    </div>
  );
};

export default BuildingInputs;
