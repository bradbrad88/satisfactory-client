import React, { useContext, useState, useEffect, useCallback, useRef } from "react";
import { FactoryManagerContext } from "contexts/FactoryManagerContext";
import { SET_FACTORY_LOCATION } from "reducers/factoryManagerReducer";

const MapLabel = ({ item, rect }) => {
  const { activeFactory, setActiveFactory, dispatch } =
    useContext(FactoryManagerContext);
  const [dragging, setDragging] = useState(false);
  // const [startLocation, setStartLocation] = useState();
  const [offset, setOffset] = useState();
  const ref = useRef();
  const { location } = item;

  const onMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  const onMouseMove = useCallback(
    e => {
      if (!dragging) return;
      const { clientX, clientY } = e;
      let x = clientX - rect.left - offset.x;
      x = (x / rect.width) * 100;
      if (x < 0) x = 0;
      if (x > 100) x = 100;
      let y = clientY - rect.top - offset.y;
      y = (y / rect.height) * 100;
      if (y < 0) y = 0;
      if (y > 100) y = 100;

      const type = SET_FACTORY_LOCATION;
      const location = { x, y };
      const payload = { location, factoryId: item.id };
      dispatch({ type, payload });
    },
    [dragging]
  );

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [onMouseUp, onMouseMove]);

  const style = () => {
    const { x, y } = location;
    return {
      left: `${x}%`,
      top: `${y}%`,
      transform: "scale(1)",
    };
  };

  const onMouseDown = e => {
    e.stopPropagation();
    const { clientX, clientY } = e;
    setDragging(true);
    setActiveFactory(item.id);
    const { left, top } = ref.current.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    setOffset({ x, y });
  };

  const active = () => {
    if (activeFactory === item) return true;
    return false;
  };

  return (
    <div
      className={`map-label ${active() ? "active" : ""}`}
      style={style()}
      onMouseDown={onMouseDown}
      ref={ref}
    >
      {item.factoryName}
    </div>
  );
};

export default MapLabel;
