import React, { useState, useContext, useRef, useLayoutEffect } from "react";
import BuildingStep from "./BuildingStep";
import { FactoryManagerContext } from "contexts/FactoryManagerContext";
import { INPUT_DROPPED_ON_BUILDING_ROW } from "reducers/factoryManagerReducer";

const BuildingRow = ({ gridRow, row, width, widthHandler }) => {
  const { activeFactory, dispatch } = useContext(FactoryManagerContext);
  const [placeholder, setPlaceholder] = useState(null);
  const [mapWidth, setMapWidth] = useState(0);
  const ref = useRef();

  useLayoutEffect(() => {
    setMapWidth(ref.current.clientWidth);
  }, [ref.current]);
  const renderBuildingSteps = () => {
    if (!gridRow) return null;
    return Array.from(gridRow, ([key, value]) => (
      <BuildingStep
        key={key.id}
        data={key}
        location={value}
        mapWidth={mapWidth}
        widthHandler={widthHandler}
      />
    ));
  };

  const getParsedData = e => {
    try {
      const data = e.dataTransfer.getData("text/plain");
      const parsedData = JSON.parse(data);
      return parsedData;
    } catch (error) {
      return null;
    }
  };

  const onDrop = e => {
    const data = getParsedData(e);
    if (data.fromInput) handleInputDrop(data, e);
  };

  const handleInputDrop = (inputData, e) => {
    const type = INPUT_DROPPED_ON_BUILDING_ROW;
    const location = { row, x: e.nativeEvent.layerX - ref.current.clientWidth / 2 };
    const payload = { factoryId: activeFactory.id, inputData, location };
    dispatch({ type, payload });
    setPlaceholder(null);
  };

  const onDragOver = e => {
    const data = getParsedData(e);
    if (data.fromInput) handleInputDrag(data, e);
    if (data.fromByProduct) {
    }
  };

  const onDragLeave = () => {
    setPlaceholder(null);
  };

  const handleInputDrag = (item, e) => {
    e.stopPropagation();
    e.preventDefault();
    // console.log("e", e.nativeEvent.layerX);
    const { layerX } = e.nativeEvent;
    setPlaceholder({ ...item, position: { x: layerX } });
    e.dataTransfer.dropEffect = "copy";
  };

  const renderPlaceholder = () => {
    if (!placeholder) return null;
    console.log("placeholder", placeholder);
    const style = {
      position: "absolute",
      left: placeholder.position.x + "px",
      transform: "translateX(-50%)",
    };
    return (
      <div style={style} className={"container building-step placeholder"}>
        <h1>Create A New Step</h1>
        <br />
        <h1>{placeholder.itemName}</h1>
      </div>
    );
  };

  return (
    <div
      className="grid-row"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      ref={ref}
      style={{ width: width + "px" }}
    >
      {renderPlaceholder()}
      {renderBuildingSteps()}
    </div>
  );
  // const [stepPositions, setStepPositions] = useState([]);
  // const renderBuildingSteps = () => {
  //   const buildingSteps = data.map(buildingStep => (
  //     <BuildingStep
  //       data={buildingStep}
  //       key={buildingStep.id}
  //       setTempNull={setTempNull}
  //     />
  //   ));
  //   if (tempStep) {
  //     const { x } = tempStep.position;
  //     const position = stepPositions.reduce((total, step) => {
  //       const { x: stepX, width } = step.rect;
  //       const diffCentre = stepX + width / 2 - x;
  //       if (!total.diff)
  //         return {
  //           diff: diffCentre,
  //           i: diffCentre <= 0 ? step.buildingStep.hor + 1 : step.buildingStep.hor,
  //         };
  //       if (Math.abs(diffCentre) < Math.abs(total.diff)) {
  //         const i =
  //           diffCentre <= 0 ? step.buildingStep.hor + 1 : step.buildingStep.hor;
  //         return { diff: diffCentre, i };
  //       }
  //       return total;
  //     }, {});
  //     setTempPosition(position.i - 0.1);
  //     const step = (
  //       <div key={"temp-step"} className={"container building-step temp"}>
  //         <h2>{tempStep.itemName}</h2>
  //         <p>{tempStep.qty}</p>
  //       </div>
  //     );
  //     buildingSteps.splice(Math.round(position.i), 0, step);
  //   }
  //   return buildingSteps;
  // };
  // return <div className={"row"}>{renderBuildingSteps()}</div>;
};

export default BuildingRow;
