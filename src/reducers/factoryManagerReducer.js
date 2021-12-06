import { v4 as uuidv4 } from "uuid";
import {
  addNewItem,
  addItemUpstream,
  autoBuildLayer,
  byProductDroppedOnInput,
  byProductDroppedOnMap,
  inputDroppedOnBuildingStep,
  inputDroppedOnMap,
  setAltOutput,
  setImported,
  setOutputQty,
  setRecipe,
} from "./buildingStepsReducer";

export const ADD_NEW_FACTORY = "ADD_NEW_FACTORY";
export const SET_FACTORY_NAME = "SET_FACTORY_NAME";
export const SET_FACTORY_LOCATION = "SET_FACTORY_LOCATION";
export const ADD_NEW_ITEM = "ADD_NEW_ITEM";
export const ADD_NEW_OUTPUT = "ADD_NEW_OUTPUT";
export const SET_ALT_OUTPUT = "SET_ALT_OUTPUT";
export const SET_RECIPE = "SET_RECIPE";
export const SET_IMPORTED = "SET_IMPORTED";
export const AUTO_BUILD_LAYER = "AUTO_BUILD_LAYER";
export const SET_OUTPUT_QTY = "SET_OUTPUT_QTY";
export const ADD_ITEM_UPSTREAM = "ADD_ITEM_UPSTREAM";
export const INPUT_DROPPED_ON_BUILDINGSTEP = "INPUT_DROPPED_ON_BUILDINGSTEP";
export const INPUT_DROPPED_ON_MAP = "INPUT_DROPPED_ON_MAP";
export const BYPRODUCT_DROPPED_ON_MAP = "BYPRODUCT_DROPPED_ON_MAP";
export const BYPRODUCT_DROPPED_ON_INPUT = "BYPRODUCT_DROPPED_ON_INPUT";

const _getFactoryById = (state, factoryId) => {
  const factory = state.find(({ id }) => id === factoryId);
  if (!factory) return null;
  return factory;
};

const addNewFactory = state => {
  const updatedState = [...state];
  const newFactory = {
    id: uuidv4(),
    factoryName: "New Factory",
    location: { x: 20, y: 50 },
    buildingSteps: [],
  };
  updatedState.push(newFactory);
  return updatedState;
};

const setFactoryName = (state, payload) => {
  const updatedState = [...state];
  const { factoryId, factoryName } = payload;
  const factory = _getFactoryById(updatedState, factoryId);
  factory.factoryName = factoryName;
  return updatedState;
};

const setFactoryLocation = (state, payload) => {
  let updatedState = [...state];
  const { factoryId, location } = payload;
  const factory = _getFactoryById(updatedState, factoryId);
  factory.location = location;
  return updatedState;
};

const addNewItemHandler = (state, payload) => {
  let updatedState = [...state];
  const { factoryId, options } = payload;
  const factory = _getFactoryById(updatedState, factoryId);
  const updatedBuildingSteps = addNewItem(factory.buildingSteps, options);
  factory.buildingSteps = updatedBuildingSteps;
  return updatedState;
};

const addItemUpstreamHandler = (state, payload) => {
  let updatedState = [...state];
  const { factoryId, buildingStep, recipe } = payload;
  const factory = _getFactoryById(updatedState, factoryId);
  const updatedBuildingSteps = addItemUpstream(
    factory.buildingSteps,
    buildingStep,
    recipe
  );
  factory.buildingSteps = updatedBuildingSteps;
  return updatedState;
};

const autoBuildLayerHandler = (state, payload) => {
  let updatedState = [...state];
  const { factoryId, buildingStep } = payload;
  const factory = _getFactoryById(updatedState, factoryId);
  const updatedBuildingSteps = autoBuildLayer(factory.buildingSteps, buildingStep);
  factory.buildingSteps = updatedBuildingSteps;
  return updatedState;
};

const setAltOutputHandler = (state, payload) => {
  let updatedState = [...state];
  const { factoryId, buildingStep, output } = payload;
  const factory = _getFactoryById(updatedState, factoryId);
  const updatedBuildingSteps = setAltOutput(
    factory.buildingSteps,
    output,
    buildingStep
  );
  factory.buildingSteps = updatedBuildingSteps;
  return updatedState;
};

const setOutputQtyHandler = (state, payload) => {
  let updatedState = [...state];
  const { factoryId, output, qty } = payload;
  const factory = _getFactoryById(updatedState, factoryId);
  const updatedBuildingSteps = setOutputQty(factory.buildingSteps, output, qty);
  factory.buildingSteps = updatedBuildingSteps;
  return updatedState;
};

const setRecipeHandler = (state, payload) => {
  let updatedState = [...state];
  const { factoryId, buildingStep, options } = payload;
  const factory = _getFactoryById(updatedState, factoryId);
  const updatedBuildingSteps = setRecipe(
    factory.buildingSteps,
    buildingStep,
    options
  );
  factory.buildingSteps = updatedBuildingSteps;
  return updatedState;
};

const setImportedHandler = (state, payload) => {
  let updatedState = [...state];
  const { factoryId, buildingStep, toggle } = payload;
  const factory = _getFactoryById(updatedState, factoryId);
  const updatedBuildingSteps = setImported(
    factory.buildingSteps,
    buildingStep,
    toggle
  );
  factory.buildingSteps = updatedBuildingSteps;
  return updatedState;
};

const byProductDroppedOnInputHandler = (state, payload) => {
  let updatedState = [...state];
  const { factoryId } = payload;
  const factory = _getFactoryById(updatedState, factoryId);
  const updatedBuildingSteps = byProductDroppedOnInput(
    factory.buildingSteps,
    payload
  );
  factory.buildingSteps = updatedBuildingSteps;
  return updatedState;
};

const byProductDroppedOnMapHandler = (state, payload) => {
  let updatedState = [...state];
  const { factoryId } = payload;
  const factory = _getFactoryById(updatedState, factoryId);
  const updatedBuildingSteps = byProductDroppedOnMap(factory.buildingSteps, payload);
  factory.buildingSteps = updatedBuildingSteps;
  return updatedState;
};

const inputDroppedOnBuildingStepHandler = (state, payload) => {
  let updatedState = [...state];
  const { factoryId, buildingStep, inputData } = payload;
  const factory = _getFactoryById(updatedState, factoryId);
  const updatedBuildingSteps = inputDroppedOnBuildingStep(
    factory.buildingSteps,
    buildingStep,
    inputData
  );
  factory.buildingSteps = updatedBuildingSteps;
  return updatedState;
};

const inputDroppedOnMapHandler = (state, payload) => {
  let updatedState = [...state];
  const { factoryId, inputData } = payload;
  const factory = _getFactoryById(updatedState, factoryId);
  const updatedBuildingSteps = inputDroppedOnMap(factory.buildingSteps, inputData);
  factory.buildingSteps = updatedBuildingSteps;
  return updatedState;
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_FACTORY_NAME:
      return setFactoryName(state, payload);
    case ADD_NEW_FACTORY:
      return addNewFactory(state);
    case SET_FACTORY_LOCATION:
      return setFactoryLocation(state, payload);
    case ADD_NEW_ITEM:
      return addNewItemHandler(state, payload);
    case ADD_ITEM_UPSTREAM:
      return addItemUpstreamHandler(state, payload);
    case AUTO_BUILD_LAYER:
      return autoBuildLayerHandler(state, payload);
    case SET_ALT_OUTPUT:
      return setAltOutputHandler(state, payload);
    case SET_OUTPUT_QTY:
      return setOutputQtyHandler(state, payload);
    case SET_RECIPE:
      return setRecipeHandler(state, payload);
    case SET_IMPORTED:
      return setImportedHandler(state, payload);
    case BYPRODUCT_DROPPED_ON_INPUT:
      return byProductDroppedOnInputHandler(state, payload);
    case BYPRODUCT_DROPPED_ON_MAP:
      return byProductDroppedOnMapHandler(state, payload);
    case INPUT_DROPPED_ON_BUILDINGSTEP:
      return inputDroppedOnBuildingStepHandler(state, payload);
    case INPUT_DROPPED_ON_MAP:
      return inputDroppedOnMapHandler(state, payload);
    default:
      return state;
  }
};

export default reducer;
