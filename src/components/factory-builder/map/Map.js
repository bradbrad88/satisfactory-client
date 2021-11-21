import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";

import BuildingStep from "./BuildingStep";

const Map = ({ data, functions, dispatch }) => {
  const [dragging, setDragging] = useState(false);
  const [initialMouse, setInitialMouse] = useState({});
  const [mapOffset, setMapOffset] = useState({ v: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const endOffset = useRef({ v: 0, h: 0 });

  const onMouseUp = useCallback(() => {
    setDragging(false);
    endOffset.current = mapOffset;
  }, [setDragging, mapOffset]);

  const onMouseDown = useCallback(
    e => {
      const { clientX, clientY } = e;
      setDragging(true);
      setInitialMouse({ clientX, clientY });
    },
    [setDragging, setInitialMouse]
  );
  const onMouseMove = useCallback(
    e => {
      if (!dragging) return;
      const { clientX, clientY } = e;
      const v = clientY - initialMouse.clientY + endOffset.current.v;
      const h = clientX - initialMouse.clientX + endOffset.current.h;
      setMapOffset({ v, h });
    },
    [initialMouse, dragging]
  );

  const renderSteps = useMemo(() => {
    const buildingSteps = data.reduce((total, buildingStep) => {
      const arr = total[buildingStep.ver] || [];
      arr.push(buildingStep);
      total[buildingStep.ver] = arr;
      return total;
    }, {});
    return Object.keys(buildingSteps).map(key => {
      const renderSteps = buildingSteps[key].map(step => (
        <BuildingStep
          data={step}
          key={step.id}
          functions={functions}
          dispatch={dispatch}
        />
      ));
      return (
        <div className={"row"} key={key}>
          {renderSteps}
        </div>
      );
    });
  }, [data, dispatch]);

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseUp, onMouseMove]);
  // console.log("data", data);
  // const {} = functions;

  if (typeof data !== "object") return null;
  if (data.length < 1) return null;

  const preventScroll = () => {
    window.addEventListener("scroll", preventScrollListener);
  };

  const enableScroll = () => {
    window.removeEventListener("scroll", preventScrollListener);
  };

  const preventScrollListener = e => {
    e.preventDefault();
  };

  const onWheel = e => {
    const STEP = 0.1;
    const { deltaY } = e;
    console.log("delta y", deltaY);
    if (deltaY < 0) return setZoom(zoom + STEP);
    if (deltaY > 0) {
      let newZoom = zoom - STEP;
      if (newZoom < 0.1) newZoom = 0.1;
      setZoom(newZoom);
    }
    // setZoom(null);
  };

  const style = () => {
    return {
      transform: `translate(${mapOffset.h}px, ${mapOffset.v}px) scale(${zoom})`,
    };
  };

  return (
    <>
      {/* <p>Dragging:{dragging}</p>
      <p>Initial mouse:{initialMouse.clientX}</p>
      <p>Offset:{mapOffset.h}</p> */}
      <div
        className={"map"}
        onMouseEnter={preventScroll}
        onMouseLeave={enableScroll}
        onMouseDown={onMouseDown}
        onWheel={onWheel}
      >
        <div
          className={"grid"}
          style={style()}

          // onMouseUp={onMouseUp}
        >
          {renderSteps}
        </div>
      </div>
    </>
  );
};

export default Map;
