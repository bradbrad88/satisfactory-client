import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import FactoryLayout from "./FactoryLayout";
import FactoryLocations from "./FactoryLocations";
import { centreMap as centreIcon } from "utils/SvgIcons";
import ReactGridTest from "./ReactGridTest";
import { FactoryManagerContext } from "contexts/FactoryManagerContext";
import { FORCE_LAYOUT_RENDER } from "reducers/factoryManagerReducer";

const Map = ({ mapState }) => {
  const { dispatch } = useContext(FactoryManagerContext);
  const [dragging, setDragging] = useState(false);
  const [initialMouse, setInitialMouse] = useState({});
  const [mapOffset, setMapOffset] = useState({ v: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const endOffset = useRef({ v: 0, h: 0 });
  const scrollRef = useRef();

  const onMouseUp = useCallback(() => {
    setDragging(false);
    endOffset.current = mapOffset;
    const type = FORCE_LAYOUT_RENDER;
    dispatch({ type });
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

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseUp, onMouseMove]);

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
    const STEP = 0.04;
    const { deltaY } = e;
    if (deltaY < 0) return setZoom(zoom + STEP);
    if (deltaY > 0) {
      let newZoom = zoom - STEP;
      if (newZoom < 0.1) newZoom = 0.1;
      setZoom(newZoom);
    }
  };

  const onDragEnterScroll = direction => {
    scrollRef.current = setInterval(
      () => {
        let stateHandler;
        const setState = stateHandler => {
          setMapOffset(prevState => {
            const newState = stateHandler(prevState);
            endOffset.current = newState;
            return newState;
          });
        };
        switch (direction) {
          case "LEFT":
            stateHandler = state => {
              return {
                ...state,
                h: state.h + 10,
              };
            };
            return setState(stateHandler);
          case "RIGHT":
            stateHandler = state => {
              return {
                ...state,
                h: state.h - 10,
              };
            };
            return setState(stateHandler);
          case "UP":
            stateHandler = state => {
              return {
                ...state,
                v: state.v + 10,
              };
            };
            return setState(stateHandler);
          case "DOWN":
            stateHandler = state => {
              return {
                ...state,
                v: state.v - 10,
              };
            };
            return setState(stateHandler);
          default:
            break;
        }
      },
      5,
      direction
    );
  };

  const onDragLeaveScroll = () => {
    clearInterval(scrollRef.current);
  };

  const style = () => {
    return {
      transform: `translate(-50%, -50%) translate(${mapOffset.h}px, ${mapOffset.v}px) scale(${zoom})`,
    };
  };

  const centreMap = () => {
    endOffset.current = { v: 0, h: 0 };
    setMapOffset({ v: 0, h: 0 });
  };

  return (
    <>
      <div
        className={"map"}
        onMouseEnter={preventScroll}
        onMouseLeave={enableScroll}
        onMouseDown={onMouseDown}
        onWheel={onWheel}
      >
        <div
          className="scroll top"
          onDragEnter={() => onDragEnterScroll("UP")}
          onDragLeave={onDragLeaveScroll}
          onDrop={onDragLeaveScroll}
        ></div>
        <div
          className="scroll right"
          onDragEnter={() => onDragEnterScroll("RIGHT")}
          onDragLeave={onDragLeaveScroll}
          onDrop={onDragLeaveScroll}
        ></div>
        <div
          className="scroll bottom"
          onDragEnter={() => onDragEnterScroll("DOWN")}
          onDragLeave={onDragLeaveScroll}
          onDrop={onDragLeaveScroll}
        ></div>
        <div
          className="scroll left"
          onDragEnter={() => onDragEnterScroll("LEFT")}
          onDragLeave={onDragLeaveScroll}
          onDrop={onDragLeaveScroll}
        ></div>
        <div
          className={"centre-map"}
          style={{
            position: "absolute",
            zIndex: "3",
            cursor: "pointer",
            top: "1rem",
            left: "1rem",
          }}
          onClick={centreMap}
        >
          {centreIcon(36)}
        </div>
        <div className={"map-content"} style={style()}>
          {mapState === "build" && <FactoryLayout scale={zoom} />}
          {mapState === "locate" && <FactoryLocations />}
        </div>
      </div>
    </>
  );
};

export default Map;
