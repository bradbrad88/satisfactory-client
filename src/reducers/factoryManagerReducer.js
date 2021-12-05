import { v4 as uuidv4 } from "uuid";

export const ADD_NEW_FACTORY = "ADD_NEW_FACTORY";
export const SET_FACTORY_NAME = "SET_FACTORY_NAME";
const _getFactoryById = (state, factoryId) => {
  const factory = state.find(({ id }) => id === factoryId);
  if (!factory) return null;
  return factory;
};

const addNewFactory = state => {
  const updatedState = [...state];
  console.log("updated state beginning", [...updatedState]);
  const newFactory = {
    id: uuidv4(),
    factoryName: "New Factory",
    location: { x: 20, y: 50 },
    buildingSteps: [],
  };
  updatedState.push(newFactory);
  console.log("updated state end", [...updatedState]);
  return updatedState;
};

const setFactoryName = (state, payload) => {
  const updatedState = [...state];
  const { factoryId, factoryName } = payload;
  const factory = _getFactoryById(updatedState, factoryId);
  factory.factoryName = factoryName;
  return updatedState;
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_FACTORY_NAME:
      return setFactoryName(state, payload);
    case ADD_NEW_FACTORY:
      return addNewFactory(state);
    default:
      return state;
  }
};

export default reducer;
