import React, { useEffect, useRef, useState } from "react";
import { edit } from "utils/SvgIcons";
import OutsideAlerter from "utils/OutsideAlerter";

const FactoryListItem = ({ factory, setActiveFactory, activeFactory }) => {
  const [factoryName, setFactoryName] = useState(factory.factoryName);
  const [editMode, setEditMode] = useState(false);
  const ref = useRef();
  const active = factory === activeFactory;

  useEffect(() => {
    setEditMode(false);
    setFactoryName(factory.factoryName);
  }, [activeFactory, factory.factoryName]);

  const onInputChange = e => {
    setFactoryName(e.target.value);
  };

  const editModeEnabled = e => {
    e.stopPropagation();
    setActiveFactory(factory.id);
    setTimeout(() => {
      setEditMode(true);
      ref.current.select();
    }, 0);
    // setEditMode(true);
  };

  return (
    <OutsideAlerter onClickOutside={() => setEditMode(false)}>
      <div
        className={`factories__list-item ${active && "active"}`}
        onClick={() => setActiveFactory(factory.id)}
      >
        {!editMode && (
          <>
            <h2>{factory.factoryName}</h2>
            <button onClick={editModeEnabled}>{edit()}</button>
          </>
        )}
        {editMode && (
          <input
            ref={ref}
            type={"text"}
            value={factoryName}
            onChange={onInputChange}
            onBlur={() => setEditMode(false)}
          />
        )}
      </div>
    </OutsideAlerter>
  );
};

export default FactoryListItem;
