import { v4 as uuidv4 } from "uuid";

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

const _newBuildingStep = options => {
  const { input, output, recipe, item, imported, hor, ver, userAdded } = options;
  if (!item) return null;
  // const inputs = input ? [input] : [];
  const outputs = output ? [output] : [];
  if (!item.recipes) console.log("new building step", item);
  const buildingStep = {
    id: uuidv4(),
    item,
    inputs: [],
    outputs,
    imported,
    recipe,
    hor,
    ver,
    userAdded,
    recipes: item.recipes || [],
  };
  if (output) {
    output.buildingStep = buildingStep;
    if (output.input) _linkInputOutput(output.input, output);
    if (!output.id) output.id = uuidv4();
  }
  if (recipe) _setRecipe(buildingStep, recipe);
  return buildingStep;
};

const _getInputById = (buildingStep, inputId) => {
  const input = buildingStep.inputs.find(input => input.id === inputId);
  if (!input) return null;
  return input;
};

const _getInputByItem = (buildingStep, item) => {
  const input = buildingStep.inputs.find(input => input.item.itemId === item.itemId);
  if (!input) return null;
  return input;
};

const _getOutputByInputId = (buildingStep, inputId) => {
  const output = buildingStep.outputs.find(output => output.inputId === inputId);
  if (!output) return null;
  return output;
};

const _getOutputById = (buildingStep, id) => {
  const output = buildingStep.outputs.find(output => output.id === id);
  if (!output) return null;
  return output;
};

const _getInputFromStateById = (state, id) => {
  let input = null;
  state.some(buildingStep => {
    input = buildingStep.inputs.find(i => i.id === id);
    return input;
  });
  return input;
};

const _getOutputFromStateById = (state, id) => {
  let output = null;
  state.some(buildingStep => {
    output = buildingStep.outputs.find(o => o.id === id);
    return output;
  });
  return output;
};

// Useful with by-products
const _getOutputByItem = (buildingStep, itemId) => {
  const output = buildingStep.outputs.find(output => output.item.itemId === itemId);
  if (!output) return null;
  return output;
};

const _getByProducts = buildingStep => {
  const byProducts = buildingStep.outputs.filter(output => output.byProduct);
  return byProducts;
};

const _getByProductsByItem = (buildingStep, item) => {
  const byProducts = buildingStep.outputs.filter(
    output => output.byProduct && output.item === item
  );
  return byProducts;
};

const _getBuildingStep = (state, buildingStepId) => {
  const buildingStep = state.find(bs => bs.id === buildingStepId);
  if (!buildingStep) return null;
  return buildingStep;
};

const _getBuildingStepOutputQty = buildingStep => {
  const outputQty = buildingStep.outputs.reduce((total, output) => {
    if (output.byProduct) return total;
    return parseFloat(output.qty) + total;
  }, 0);
  return outputQty;
};

const _getRecipeOutputQty = buildingStep => {
  const recipeItem = buildingStep.recipe.RecipeItems.find(
    recipeItem => recipeItem.item === buildingStep.item
  );
  return recipeItem.qty;
};

const _getInputSuppliedQty = input => {
  // Get the amount of items currently being sent to this building step's input
  return input.outputs.reduce((total, output) => {
    // const output = _getOutput(buildingStep, input.id);
    // if (!output) return total;
    return total + output.qty;
  }, 0);
};

const _getRecipeInputItems = buildingStep => {
  if (!buildingStep.recipe) return [];
  const inputItems = buildingStep.recipe.RecipeItems.filter(
    recipeItem => recipeItem.direction === "input"
  );
  return inputItems;
};

const _getRecipeByProducts = (recipe, item) => {
  return recipe.RecipeItems.filter(
    recipeItem => recipeItem.direction === "output" && recipeItem.item !== item
  );
};

const _destroyInput = input => {
  input.outputs.forEach(output => {
    _destroyOutput(output);
    if (output.buildingStep.outputs.length < 1 && !output.buildingStep.userAdded)
      _destroyBuildingStep(output.buildingStep);
  });
  input.buildingStep.inputs = input.buildingStep.inputs.filter(i => i !== input);
};

const _destroyOutput = output => {
  const { buildingStep } = output;
  if (output.input) _unlinkOutputFromInput(output);
  buildingStep.outputs = buildingStep.outputs.filter(o => o !== output);
};

const _destroyBuildingStep = buildingStep => {
  buildingStep.outputs.forEach(output => {
    _destroyOutput(output);
  });
  buildingStep.inputs.forEach(input => {
    _destroyInput(input);
  });
  buildingStep.delete = true;
};

const _addOutput = output => {
  output.buildingStep.outputs.push(output);
  _setInputQtys(output.buildingStep);
};

const _editOutput = (output, qty, overrideLock) => {
  if (output.locked && !overrideLock) return false;
  output.qty = qty;
  _setInputQtys(output.buildingStep);
  return true;
};

const _setRecipe = (buildingStep, recipe) => {
  buildingStep.recipe = recipe;
  _setNewInputs(buildingStep);
  _setByProduct(buildingStep);
};

const _setBuildingCount = buildingStep => {};

const _setNewInputs = buildingStep => {
  const recipeItems = _getRecipeInputItems(buildingStep);
  const remainingRecipeItems = _removeRedundantIOs(buildingStep.inputs, recipeItems);

  if (recipeItems.length < 1) return;
  const totalOutput = _getBuildingStepOutputQty(buildingStep);
  const recipeOutputQty = _getRecipeOutputQty(buildingStep);
  const inputs = recipeItems.map(recipeItem => {
    if (remainingRecipeItems.includes(recipeItem)) {
      // new input, give it the full treatment
      const newInput = {
        id: uuidv4(),
        buildingStep,
        outputs: [],
        item: recipeItem.item,
        recipeQty: recipeItem.qty,
        qty: (recipeItem.qty / recipeOutputQty) * totalOutput,
      };
      return newInput;
    } else {
      // existing item, adjust qtys only
      const existingInput = _getInputByItem(buildingStep, recipeItem.item);
      existingInput.qty = (recipeItem.qty / recipeOutputQty) * totalOutput;
      existingInput.recipeQty = recipeItem.qty;
      return existingInput;
    }
  });
  console.log("inputs", inputs);
  buildingStep.inputs = inputs;
  if (totalOutput) {
    _setInputQtys(buildingStep);
  }
};

const _setInputQtys = buildingStep => {
  const { inputs } = buildingStep;
  if (!buildingStep.recipe) return;
  _setByProductQty(buildingStep);
  if (inputs.length < 1) return;
  const totalOutput = _getBuildingStepOutputQty(buildingStep);
  // if (!totalOutput) _removeAllInputs(buildingStep);
  const recipeOutputQty = _getRecipeOutputQty(buildingStep);
  inputs.forEach(input => {
    const qty = (input.recipeQty / recipeOutputQty) * totalOutput;
    input.qty = qty;
    const remainingQty = input.qty - _getInputSuppliedQty(input);
    // run updateOutputQty until it finds an appropriate output and completes successfully
    if (remainingQty)
      input.outputs
        .filter(output => !output.byProduct)
        .some(output => _editOutput(output, remainingQty + output.qty));
  });
};

const _setByProduct = buildingStep => {
  if (!buildingStep.recipe || !buildingStep.item) {
    const byProducts = _getByProducts(buildingStep);
    return byProducts.forEach(output => _destroyOutput(output));
  }
  const byProductRecipeItems = _getRecipeByProducts(
    buildingStep.recipe,
    buildingStep.item
  );
  const byProducts = _getByProducts(buildingStep);
  const remainingRecipeItems = _removeRedundantIOs(byProducts, byProductRecipeItems);
  const newOutputs = remainingRecipeItems.map(recipeItem => ({
    id: uuidv4(),
    buildingStep,
    item: recipeItem.item,
    qty: 0,
    byProduct: true,
    recipeQty: recipeItem.qty,
  }));
  buildingStep.outputs = buildingStep.outputs.concat(newOutputs);
  _setByProductQty(buildingStep);
};

const _setByProductQty = buildingStep => {
  const totalOutput = _getBuildingStepOutputQty(buildingStep);
  const recipeOutputQty = _getRecipeOutputQty(buildingStep);
  console.log("recipe output qty", recipeOutputQty);
  const byProducts = _getByProducts(buildingStep); // buildingStep.outputs.filter(output => output.byProduct);
  byProducts.forEach(byProduct => {
    byProduct.qty = (byProduct.recipeQty / recipeOutputQty) * totalOutput;
  });
  // TODO - just so much to do
};

const _linkInputOutput = (input, output) => {
  output.input = input;
  if (!input.outputs.includes(output)) input.outputs.push(output);
};

const _unlinkOutputFromInput = output => {
  const { input } = output;
  if (!input) return false;
  input.outputs = input.outputs.filter(o => o !== output);
  return true;
};

//
const _removeRedundantIOs = (transputs, newRecipeItems) => {
  const recipeItems = [...newRecipeItems];
  transputs.forEach(transput => {
    const required = recipeItems.find(
      recipeItem => recipeItem.item === transput.item
    );
    if (!required) {
      // Determine if input or output - input will always have outputs as a property, even if just empty array
      if (transput.outputs) {
        _destroyInput(transput);
      } else {
        _destroyOutput(transput);
      }
    } else {
      // leave input as is (setNewInputs responsible for setting new qty/recipeQty)
      // remove from recipeItems (this array will be used to create new inputs)
      const i = recipeItems.indexOf(required);
      recipeItems.splice(i, 1);
    }
  });
  return recipeItems;
};

const _findDefaultItem = recipe => {
  const { item } = recipe.RecipeItems.reduce((defaultItem, currentItem) => {
    if (currentItem.direction !== "output") return defaultItem;
    console.log("find default item", currentItem);
    if (currentItem.item.points > (defaultItem?.item.points || 0))
      return currentItem;
    return defaultItem;
  }, null);
  return item;
};

const _removeBuildingStepsWithNoIO = state => {
  let updatedState = [...state];
  updatedState = updatedState.filter(buildingStep => !buildingStep.delete);
  return updatedState;
};

const _assignVerticalPosition = buildingStep => {
  // Two building steps that output to each other (recycled oil) are siblings
  // let sibling = null;
  const ver = buildingStep.outputs.reduce((total, output) => {
    // Check for siblings
    // TODO - need fixing with new input/output structure
    const sibling = output.buildingStep?.outputs.find(
      output => output.buildingStep === buildingStep
    );
    const relativeBuildingStepPosition = sibling
      ? parseInt(sibling.ver || 1)
      : parseInt(output.buildingStep?.ver || 0) + 1;
    return Math.max(
      relativeBuildingStepPosition,
      total
      // output.buildingStep?.ver || 0
    );
  }, 0);
  buildingStep.ver = ver;
  buildingStep.inputs.forEach(input => {
    input.buildingSteps.forEach(inputBuildingStep => {
      const sibling = inputBuildingStep.inputs.some(input =>
        input.buildingSteps.includes(buildingStep)
      );
      if (!sibling) _assignVerticalPosition(inputBuildingStep);
    });
  });
};

const _assignHorizontalPosition = state => {
  let updatedState = [...state];
  const rows = updatedState.reduce((total, buildingStep) => {
    const arr = total[buildingStep.ver] || [];
    arr.push(buildingStep);
    total[buildingStep.ver] = arr;
    return total;
  }, {});

  Object.keys(rows).forEach(key => {
    rows[key]
      .sort((a, b) => {
        if (b.hor === undefined || b.hor === null) return -1;
        if (a.hor === undefined || a.hor === null) return 1;
        return a.hor - b.hor;
      })
      .forEach((row, i) => (row.hor = i));
  });
  return updatedState;
};

const _findTopLevelSteps = state => {
  // buildingStep can have a 'step' type output and still be top level so long as that step is a sibling - ie: the sibling building step should have a (non-by-product) output pointing to the original building step
  const topLevelSteps = state.filter(buildingStep => {
    const sibling = _getSibling(buildingStep);
    const fail = buildingStep.outputs.some(output => {
      if (output.byProduct) return false;
      if (output.input?.buildingStep === sibling) return false;
      if (output.input) return true;
      return false;
    });
    return !fail;
  });
  return topLevelSteps;
};

// TODO - structural change to this function, check dependants - should check a whole building step for a sibling only once
const _getSibling = buildingStep => {
  const outputToSibling = buildingStep.outputs
    .filter(output => !output.byProduct)
    .find(output => {
      return buildingStep.inputs.some(input =>
        input.outputs.some(o => o.buildingStep === output.input?.buildingStep)
      );
    });
  if (!outputToSibling) return null;
  const sibling = outputToSibling.input.buildingStep;
  return sibling;
};

const _calcPosition = updatedState => {
  // Get the top level steps - they should not contain outputs with buildingSteps
  // Can include a byProduct output with buildingStep
  // Can include output with sibling input step
  _findTopLevelSteps(updatedState)
    // With top level items found
    .forEach(buildingStep => {
      _assignVerticalPosition(buildingStep);
    });
  // Create object with rows as properties
  // Each row contains array of buildingSteps on that vertically positioned row
  updatedState = _assignHorizontalPosition(updatedState);
  return updatedState;
};

const addNewItem = (state, options) => {
  let updatedState = [...state];
  const newBuildingStep = _newBuildingStep(options);
  updatedState = [...updatedState, newBuildingStep];
  updatedState = _removeBuildingStepsWithNoIO(updatedState);
  // updatedState = _calcPosition(updatedState);
  return updatedState;
};

const addNewOutput = (state, buildingStep, input) => {
  let updatedState = [...state];
  // BuildingStep refers to the targeted step to create a new output on
  // Input belongs to the parent buildingStep
  const parentBuildingStep = updatedState.find(bs =>
    bs.inputs.some(i => input.id === i.id)
  );
  const qty = input.qty - _getInputSuppliedQty(input);
  const output = {
    id: input.id,
    buildingStep: parentBuildingStep,
    qty,
    item: input.item,
    type: "step",
  };
  _addOutput(buildingStep, output);
  return updatedState;
};

const addItemUpstream = (state, buildingStep, recipe) => {
  let updatedState = [...state];
  const item = _findDefaultItem(recipe);
  console.log("state", state);
  console.log("buildingStep", buildingStep);
  console.log("recipe", recipe);
  console.log("item", item);
  const options = {
    imported: false,
    recipe: recipe,
    item,
    userAdded: true,
    ver: (buildingStep.ver || 0) - 1,
  };
  const newBuildingStep = _newBuildingStep(options);
  console.log("new building step with failing input", { ...newBuildingStep });
  const input = _getInputByItem(newBuildingStep, buildingStep.item);
  const output = {
    id: uuidv4(),
    buildingStep,
    qty: 0,
    type: "step",
    item: buildingStep.item,
  };
  _linkInputOutput(input, output);
  _addOutput(output);
  updatedState = [...updatedState, newBuildingStep];
  // updatedState = _calcPosition(updatedState);
  return updatedState;
};

const _getByProductUpstreamQty = () => {
  // Gonst ta be tricky
};

// TODO
const byProductDroppedOnMap = (state, payload) => {
  let updatedState = [...state];
  const { recipe, itemId, byProductId } = payload;
  // const buildingStep = _getBuildingStep(updatedState, buildingStepId);
  const byProduct = _getOutputFromStateById(updatedState, byProductId);

  console.log("by product", byProduct);
  const item = _findDefaultItem(recipe);
  const options = {
    item,
    recipe,
    imported: false,
    userAdded: true,
  };

  const newBuildingStep = _newBuildingStep(options);
  const input = _getInputByItem(newBuildingStep, byProduct.item);
  _linkInputOutput(input, byProduct);
  updatedState.push(newBuildingStep);
  return updatedState;
};

// TODO
const byProductDroppedOnInput = (state, payload) => {
  let updatedState = [...state];
  const { byProductId, input } = payload;
  const byProduct = _getOutputFromStateById(state, byProductId);
  // console.log("byproduct id", byProductId);
  // console.log("itemId", itemId);
  // console.log("buildingStepId", buildingStepId);
  // console.log("inputBuildingStep", inputBuildingStep);
  // console.log("input", input);
  _linkInputOutput(input, byProduct);
  // get the output and buildingStep firstoff
  // const output = _getOutputByItem(buildingStep);
  // see if the output is connected to anything already

  // look for multiple of the same by-product

  // split

  // qty = output.qty
  // output.type = 'step'
  // output.buildingStep
  // output.id

  return updatedState;
};

const setAltOutput = (state, output, buildingStep) => {
  let updatedState = [...state];
  const { type, qty } = output;
  const existingOutput = buildingStep.outputs.find(output => output.type === type);

  if (existingOutput) {
    _editOutput(existingOutput, qty);
  } else {
    const output = {
      id: uuidv4(),
      buildingStep,
      type,
      qty,
      item: buildingStep.item,
    };
    _addOutput(output);
  }
  return updatedState;
};

const setOutputQty = (state, output, qty) => {
  let updatedState = [...state];
  _editOutput(output, qty, true);
  output.locked = true;
  updatedState = _removeBuildingStepsWithNoIO(updatedState);
  return updatedState;
};

const inputDroppedOnBuildingStep = (state, buildingStep, inputData) => {
  // Update a child buildingStep with a new or adjusted output to correctly supply the parent input with correct amount of materials

  // Qty should never go below zero

  // If input has a surplus and there is already a connection then the buildingStep should reduce its qty to match

  let updatedState = [...state];
  // see if connection exists already between the input and buildingStep
  const parentBuildingStep = _getBuildingStep(
    updatedState,
    inputData.buildingStepId
  );
  const input = _getInputById(parentBuildingStep, inputData.inputId);
  const existingOutput = input.outputs.find(
    output => output.buildingStep === buildingStep
  );
  const qty = input.qty - _getInputSuppliedQty(input);
  if (existingOutput) {
    // if it does then
    _editOutput(existingOutput, qty + existingOutput.qty, true);
    existingOutput.locked = false;
  } else {
    const output = {
      id: uuidv4(),
      buildingStep,
      qty,
      item: input.item,
      type: "step",
    };
    _linkInputOutput(input, output);
    _addOutput(output);
  }
  return updatedState;
};

const inputDroppedOnMap = (state, inputData) => {
  const updatedState = [...state];
  const { inputId } = inputData;
  const input = _getInputFromStateById(updatedState, inputId);
  if (!input) {
    console.error(
      `Couldn't find input using _getInputFromStateById \n Likely searched for an input recently removed from state. Id: ${inputId}`
    );
    return updatedState;
  }
  const remainingQty = input.qty - _getInputSuppliedQty(input);
  const output = {
    qty: remainingQty,
    type: "step",
    input,
    item: input.item,
  };
  const options = {
    output,
    imported: true,
    item: input.item,
    ver: input.buildingStep.ver + 1,
  };
  const newBuildingStep = _newBuildingStep(options);
  updatedState.push(newBuildingStep);
  return updatedState;
};

const setImported = (state, buildingStep, toggle) => {
  let updatedState = [...state];
  buildingStep.imported = toggle;
  if (buildingStep.recipes.length > 0) {
    const recipe = toggle ? null : buildingStep.recipes[0];
    _setRecipe(buildingStep, recipe);
  }
  // _setInputs(buildingStep);
  // setByProduct(buildingStep);
  updatedState = _removeBuildingStepsWithNoIO(updatedState);
  // updatedState = _calcPosition(updatedState);
  return updatedState;
};

const setRecipe = (state, buildingStep, options) => {
  let updatedState = [...state];
  if (buildingStep.recipes < 1) {
    // TODO - No recipes available - ignore step??? - what are the follow-ons from here
    return;
  }
  if (buildingStep.imported) {
    buildingStep.recipe = null;
  } else if (options?.recipe) {
    buildingStep.recipe = options.recipe;
  } else {
    buildingStep.recipe = buildingStep.recipes[0];
  }
  _setNewInputs(buildingStep);
  _setByProduct(buildingStep);
  updatedState = _removeBuildingStepsWithNoIO(updatedState);
  return updatedState;
};

const autoBuildLayer = (state, buildingStep) => {
  let updatedState = [...state];
  // Check for inputs length
  if (buildingStep.inputs.length < 1) return;
  // Loop through each input
  buildingStep.inputs.forEach(input => {
    // Check within the previous state for any building steps already producing the input item
    const validBuildingStep = updatedState.find(bs => bs.item === input.item);
    console.log("valid building step", validBuildingStep);
    if (validBuildingStep) {
      let validOutput = validBuildingStep.outputs.find(
        output => output.buildingStep === buildingStep && !output.byProduct
      );
      if (!validOutput) {
        const newOutput = {
          id: uuidv4(),
          type: "step",
          item: input.item,
          buildingStep: validBuildingStep,
          qty: input.qty,
        };
        _linkInputOutput(input, newOutput);
        _addOutput(newOutput);
      } else {
        const remainingQty =
          input.qty - (_getInputSuppliedQty(input) - validOutput.qty);
        _editOutput(validBuildingStep, validOutput, remainingQty);
      }
    } else {
      const options = { imported: true, item: input.item };
      const newBuildingStep = _newBuildingStep(options);
      const newOutput = {
        id: uuidv4(),
        type: "step",
        qty: input.qty,
        item: input.item,
        buildingStep: newBuildingStep,
      };
      _linkInputOutput(input, newOutput);
      _addOutput(newOutput);
      updatedState = [...updatedState, newBuildingStep];
    }
  });
  // updatedState = _calcPosition(updatedState);
  return updatedState;
};

const reducer = (state, action) => {
  const { type, payload } = action;
  const { buildingStep, output, recipe, toggle, options, qty, inputData } = payload;
  switch (type) {
    case ADD_NEW_ITEM:
      return addNewItem(state, options);
    case ADD_ITEM_UPSTREAM:
      return addItemUpstream(state, buildingStep, recipe);
    case ADD_NEW_OUTPUT:
      return state;
    case SET_ALT_OUTPUT:
      return setAltOutput(state, output, buildingStep);
    case SET_OUTPUT_QTY:
      return setOutputQty(state, output, qty);
    case INPUT_DROPPED_ON_BUILDINGSTEP:
      return inputDroppedOnBuildingStep(state, buildingStep, inputData);
    case INPUT_DROPPED_ON_MAP:
      return inputDroppedOnMap(state, inputData);
    case BYPRODUCT_DROPPED_ON_MAP:
      return byProductDroppedOnMap(state, payload);
    case BYPRODUCT_DROPPED_ON_INPUT:
      return byProductDroppedOnInput(state, payload);
    case SET_IMPORTED:
      return setImported(state, buildingStep, toggle);
    case SET_RECIPE:
      return setRecipe(state, buildingStep, options);
    case AUTO_BUILD_LAYER:
      return autoBuildLayer(state, buildingStep);

    default:
      return state;
  }
};

export default reducer;
