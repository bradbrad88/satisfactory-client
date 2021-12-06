import React, { useReducer, useState } from "react";
import factoryManagerReducer from "reducers/factoryManagerReducer";
import { v4 as uuidv4 } from "uuid";

import useData from "hooks/useData";

export const FactoryManagerContext = React.createContext();

const dummyFactories = [
  {
    id: uuidv4(),
    factoryName: "Dune Factory",
    buildingSteps: [],
    location: { x: 20, y: 25 },
  },
  {
    id: uuidv4(),
    factoryName: "Iron Factory",
    buildingSteps: [],
    location: { x: 30, y: 25 },
  },
];

const FactoryManagerProvider = ({ children }) => {
  const [factories, dispatch] = useReducer(factoryManagerReducer, dummyFactories);
  const [activeFactoryId, setActiveFactoryId] = useState(null);
  const { items, recipes } = useData();
  const activeFactory = () => {
    console.log("finding active factory");
    return factories.find(({ id }) => id === activeFactoryId);
  };

  const handleDispatch = ({ type, payload = {} }) => {
    const payloadWithActiveFactory = { ...payload };
    payloadWithActiveFactory.factoryId = activeFactoryId;
    dispatch({ type, payload: payloadWithActiveFactory });
  };

  return (
    <FactoryManagerContext.Provider
      value={{
        factories,
        dispatch: handleDispatch,
        activeFactory: activeFactory(),
        setActiveFactory: setActiveFactoryId,
        items,
        recipes,
      }}
    >
      {children}
    </FactoryManagerContext.Provider>
  );
};

export default FactoryManagerProvider;
