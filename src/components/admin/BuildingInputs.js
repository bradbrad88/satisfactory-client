import React from "react";
import pipeImage from "../../assets/pipe.webp";
import conveyorImage from "../../assets/conveyor.webp";

const BuildingInputs = ({ pipes, conveyors, type, handleChange }) => {
  const editPipe = input => {
    let newPipes = pipes + input;
    if (newPipes > 6) newPipes = pipes;
    const newState = { pipes: newPipes, conveyors };
    console.log("new state", newState);
    handleChange(type, newState);
  };

  const editConveyor = input => {
    let newConveyors = conveyors + input;
    if (newConveyors > 6) newConveyors = conveyors;
    const newState = { pipes, conveyors: newConveyors };
    handleChange(type, newState);
  };

  const renderPipes = () => {
    const pipeElements = [];
    for (let i = 0; i < pipes; i++) {
      pipeElements.push(
        <button
          className={""}
          onClick={() => editPipe(-1)}
          title={`Remove pipe ${type}`}
        >
          <img src={pipeImage} style={{ width: "50px" }} />
        </button>
      );
    }
    return pipeElements;
  };
  const renderConveyors = () => {
    const conveyorElements = [];
    for (let i = 0; i < conveyors; i++) {
      conveyorElements.push(
        <button
          className={""}
          onClick={() => editConveyor(-1)}
          title={`Remove conveyor ${type}`}
        >
          <img src={conveyorImage} style={{ width: "50px" }} />
        </button>
      );
    }
    return conveyorElements;
  };
  return (
    <div className={"building-inputs-type"}>
      <div className={"building-inputs-header"}>
        <span className={"building-inputs-title"}>{type}</span>
        <div className={"add"}>
          <button onClick={() => editConveyor(1)} title={`Add pipe ${type}`}>
            <img src={conveyorImage} style={{ width: "30px" }} />
          </button>
          <button onClick={() => editPipe(1)} title={`Add pipe ${type}`}>
            <img src={pipeImage} style={{ width: "30px" }} />
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
