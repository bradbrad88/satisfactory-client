import React, { useContext } from "react";
import FactoryListItem from "./FactoryListItem";
import { building } from "utils/SvgIcons";
import { ADD_NEW_FACTORY } from "reducers/factoryManagerReducer";
import { FactoryManagerContext } from "contexts/FactoryManagerContext";

const Factories = () => {
  const { factories, setActiveFactory, activeFactory, dispatch } =
    useContext(FactoryManagerContext);
  const renderFactoryList = () => {
    return factories.map(factory => (
      <FactoryListItem
        factory={factory}
        activeFactory={activeFactory}
        setActiveFactory={setActiveFactory}
        key={factory.id}
      />
    ));
  };

  const addNewFactory = () => {
    const type = ADD_NEW_FACTORY;
    dispatch({ type });
  };

  return (
    <div className={"ui-component factories"}>
      <button onClick={addNewFactory}>New Factory{building(40)}</button>
      {renderFactoryList()}
    </div>
  );
};

export default Factories;
