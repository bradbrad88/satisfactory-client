import React, { useReducer, useState } from "react";
import factoryManagerReducer from "reducers/factoryManagerReducer";
import { v4 as uuidv4 } from "uuid";

import useData from "hooks/useData";

export const GRID_COL_WIDTH = 30;
export const GRID_ROW_HEIGHT = 450;

export const FactoryManagerContext = React.createContext();

const dummyFactories = [
  {
    id: uuidv4(),
    factoryName: "Dune Factory",
    buildingSteps: [],
    location: { x: 20, y: 25 },
    layout: [],
    canvasWidth: 1500,
  },
  {
    id: uuidv4(),
    factoryName: "Iron Factory",
    buildingSteps: [],
    location: { x: 30, y: 25 },
    layout: [],
    canvasWidth: 1500,
  },
];

const FactoryManagerProvider = ({ children }) => {
  const [factories, dispatch] = useReducer(factoryManagerReducer, dummyFactories);
  const [activeFactory, setActiveFactory] = useState(null);
  const { items, recipes } = useData();

  const handleActiveFactory = factoryId => {
    const factory = factories.find(({ id }) => id === factoryId);
    setActiveFactory(factory);
  };

  const handleDispatch = ({ type, payload = {} }) => {
    if (!activeFactory) return;
    const payloadWithActiveFactory = { ...payload };
    payloadWithActiveFactory.factoryId = activeFactory.id;
    dispatch({ type, payload: payloadWithActiveFactory });
  };

  return (
    <FactoryManagerContext.Provider
      value={{
        factories,
        dispatch: handleDispatch,
        activeFactory,
        layout: activeFactory ? activeFactory.layout : null,
        canvasWidth: activeFactory ? activeFactory.canvasWidth : 0,
        setActiveFactory: handleActiveFactory,
        items,
        recipes,
      }}
    >
      {children}
    </FactoryManagerContext.Provider>
  );
};

export default FactoryManagerProvider;
