import React, { useContext, useEffect, useRef, useState } from "react";
import { edit } from "utils/SvgIcons";
import { FactoryManagerContext } from "contexts/FactoryManagerContext";
import { SET_FACTORY_NAME } from "reducers/factoryManagerReducer";

const FactoryListItem = ({ factory, setActiveFactory, activeFactory }) => {
  const { dispatch } = useContext(FactoryManagerContext);
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

  const setNewName = () => {
    console.log("setting new name", factoryName);
    const type = SET_FACTORY_NAME;
    const payload = { factoryId: factory.id, factoryName };
    dispatch({ type, payload });
    setEditMode(false);
  };

  const onKeyDown = e => {
    const { key } = e;

    switch (key) {
      case "Escape":
        setEditMode(false);
        setFactoryName(factory.factoryName);
        break;
      case "Enter":
        setNewName();
        break;
      default:
        break;
    }
  };

  return (
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
          onBlur={setNewName}
          onKeyDown={onKeyDown}
        />
      )}
    </div>
  );
};

export default FactoryListItem;
