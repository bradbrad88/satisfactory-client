import React, { useState } from "react";
import BuildingStep from "./BuildingStep";
const BuildingRow = ({
  data,
  inputDrag,
  tempStep,
  setTempPosition,
  setTempNull,
  dispatch,
  setActiveItem,
  activeItem,
}) => {
  const [stepPositions, setStepPositions] = useState([]);
  const updateDomPosition = (ref, buildingStep) => {
    console.log("setting step positions");
    setStepPositions(prevState => {
      const step = prevState.find(step => buildingStep.id === step.buildingStep.id);
      if (step) {
        step.rect = ref.getBoundingClientRect();
        return prevState;
      } else {
        prevState.push({ buildingStep, rect: ref.getBoundingClientRect() });
        return prevState;
      }
    });
  };

  const renderBuildingSteps = () => {
    const buildingSteps = data.map(buildingStep => (
      <BuildingStep
        data={buildingStep}
        inputDrag={inputDrag}
        key={buildingStep.id}
        dispatch={dispatch}
        updateDomPosition={updateDomPosition}
        setTempNull={setTempNull}
        setActiveItem={setActiveItem}
        activeItem={activeItem}
      />
    ));
    if (tempStep) {
      const { x } = tempStep.position;
      const position = stepPositions.reduce((total, step) => {
        const { x: stepX, width } = step.rect;
        const diffCentre = stepX + width / 2 - x;
        if (!total.diff)
          return {
            diff: diffCentre,
            i: diffCentre <= 0 ? step.buildingStep.hor + 1 : step.buildingStep.hor,
          };
        if (Math.abs(diffCentre) < Math.abs(total.diff)) {
          const i =
            diffCentre <= 0 ? step.buildingStep.hor + 1 : step.buildingStep.hor;
          console.log("the closest", diffCentre, step, i);
          return { diff: diffCentre, i };
        }
        return total;
      }, {});
      setTempPosition(position.i - 0.1);
      const step = (
        <div className={"container building-step temp"}>
          <h2>{tempStep.itemName}</h2>
          <p>{tempStep.qty}</p>
        </div>
      );
      buildingSteps.splice(Math.round(position.i), 0, step);
    }
    return buildingSteps;
  };
  return <div className={"row"}>{renderBuildingSteps()}</div>;
};

export default BuildingRow;
