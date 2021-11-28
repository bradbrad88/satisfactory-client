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
export const BYPRODUCT_DROPPED_ON_MAP = "BYPRODUCT_DROPPED_ON_MAP";

const _newBuildingStep = options => {
  const { input, output, recipe, item, imported, hor, userAdded } = options;
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
    userAdded,
    recipes: item.recipes || [],
  };
  if (recipe) _setRecipe(buildingStep, recipe);
  if (!output) return buildingStep;
  if (output.buildingStep && output.id) {
    _linkInput(buildingStep, output.id);
  }
  return buildingStep;
};

const _getInput = (buildingStep, inputId) => {
  const input = buildingStep.inputs.find(input => input.id === inputId);
  if (!input) return null;
  return input;
};

const _getInputByItem = (buildingStep, item) => {
  return buildingStep.inputs.find(input => input.item === item);
};

const _getOutput = (buildingStep, inputId) => {
  const output = buildingStep.outputs.find(output => output.id === inputId);
  if (!output) return null;
  return output;
};

// Useful with by-products
const _getOutputByItem = (buildingStep, itemId) => {
  const output = buildingStep.outputs.find(output => output.item.itemId === itemId);
  return output;
};

const _getBuildingStep = (state, buildingStepId) => {
  const buildingStep = state.find(bs => bs.id === buildingStepId);
  if (!buildingStep) return null;
  return buildingStep;
};

const _removeLinkToOutput = (buildingStep, inputBuildingStep, inputId) => {
  const input = _getInput(inputBuildingStep, inputId);
  console.log("removing buildingStep from input", input);
  if (!input) return;
  const filteredBuildingSteps = input.buildingSteps.filter(
    bs => bs !== buildingStep
  );
  if (filteredBuildingSteps.length === input.buildingSteps.length) return false;
  input.buildingSteps = filteredBuildingSteps;
  return true;
};

const _getRecipeOutputQty = buildingStep => {
  const recipeItem = buildingStep.recipe.RecipeItems.find(
    recipeItem => recipeItem.item === buildingStep.item
  );
  return recipeItem.qty;
};

const _getInputSuppliedQty = input => {
  // Get the amount of items currently being sent to this building step's input
  return input.buildingSteps.reduce((total, buildingStep) => {
    const output = _getOutput(buildingStep, input.id);
    if (!output) return total;
    return total + output.qty;
  }, 0);
};

const _setRecipe = (buildingStep, recipe) => {
  buildingStep.recipe = recipe;
  _setNewInputs(buildingStep);
  _setByProduct(buildingStep);
};

const _setBuildingCount = buildingStep => {
  // if (!buildingStep.recipe) {
  //   buildingStep.building = null;
  //   buildingStep.buildingCount = null;
  //   return;
  // }
  // buildingStep.building = buildingStep.recipe.building;
  // buildingStep.buildingCount =
  //   _getBuildingStepOutputQty(buildingStep) / _getRecipeOutputQty(buildingStep);
};

const _removeAllInputs = buildingStep => {
  buildingStep.inputs.forEach(input => {
    input.buildingSteps.forEach(bs => {
      // bs.outputs = bs.outputs.filter(output => output.buildingStep !== buildingStep);
      const output = bs.outputs.find(output => output.id === input.id);
      _editOutput(bs, output, 0);
    });
  });
  buildingStep.inputs = [];
};

const _getRecipeInputItems = buildingStep => {
  if (!buildingStep.recipe) return [];
  const inputItems = buildingStep.recipe.RecipeItems.filter(
    recipeItem => recipeItem.direction === "input"
  );
  return inputItems;
};

const _updateOutputQty = (buildingStep, inputId, qty) => {
  const output = buildingStep.outputs.find(output => output.id === inputId);
  console.log("output", output);
  console.log("qty", qty);
  if (!output) return false;
  if (output.locked) return false;
  if (output.byProduct) return false;
  output.qty += qty;
  _setInputQtys(buildingStep);
  return true;
};

const _setInputQtys = buildingStep => {
  if (!buildingStep.recipe) return;
  const { inputs } = buildingStep;
  const totalOutput = _getBuildingStepOutputQty(buildingStep);
  if (!totalOutput) _removeAllInputs(buildingStep);
  const recipeOutputQty = _getRecipeOutputQty(buildingStep);
  inputs.forEach(input => {
    const qty = (input.recipeQty / recipeOutputQty) * totalOutput;
    if (qty === input.qty) return;
    input.qty = qty;
    const remainingQty = input.qty - _getInputSuppliedQty(input);
    // run updateOutputQty until it finds an appropriate output and completes successfully
    input.buildingSteps.some(bs => _updateOutputQty(bs, input.id, remainingQty));
  });
  _setByProductQty(buildingStep);
};

const _setNewInputs = buildingStep => {
  _removeAllInputs(buildingStep);
  if (!buildingStep.recipe) return;
  const recipeItems = _getRecipeInputItems(buildingStep);
  console.log("recipe items", recipeItems);
  const totalOutput = _getBuildingStepOutputQty(buildingStep);
  const recipeOutputQty = _getRecipeOutputQty(buildingStep);
  const inputs = recipeItems.map(recipeItem => ({
    id: uuidv4(),
    buildingSteps: [],
    item: recipeItem.item,
    recipeQty: recipeItem.qty,
    qty: (recipeItem.qty / recipeOutputQty) * totalOutput,
  }));
  console.log("inputs", inputs);
  buildingStep.inputs = inputs;
};

const _findDefaultItem = recipe => {
  const item = recipe.RecipeItems.reduce((defaultItem, currentItem) => {
    if (currentItem.direction !== "output") return defaultItem;
    console.log("find default item", currentItem);
    if (currentItem.item.points > (defaultItem?.item.points || 0))
      return currentItem.item;
    return defaultItem;
  }, null);
  return item;
};

const _addOutput = (buildingStep, output) => {
  buildingStep.outputs.push(output);
  console.log("output - add output", { ...output });
  if (output.type === "step") {
    console.log("linking output - id:", output.id);
    _linkInput(buildingStep, output.id);
  }
  _setInputQtys(buildingStep);
};

const _editOutput = (buildingStep, output, qty) => {
  console.log("editing output - qty", qty);
  if (!qty) {
    if (output.type === "step") {
      console.log(
        "editing output - no qty input",
        buildingStep,
        output.buildingStep,
        output.id
      );
      _removeLinkToOutput(buildingStep, output.buildingStep, output.id);
    }
    buildingStep.outputs = buildingStep.outputs.filter(o => o !== output);
  }
  output.qty = qty;
  _setInputQtys(buildingStep);
};

const _linkInput = (buildingStep, inputId) => {
  // Adds the supplied buildingStep to input.buildingSteps
  const output = _getOutput(buildingStep, inputId);
  if (!output.buildingStep) return null;
  const input = _getInput(output.buildingStep, inputId);
  output.id = input.id;
  input.buildingSteps.push(buildingStep);
  return true;
};

const _setByProductQty = buildingStep => {
  const totalOutput = _getBuildingStepOutputQty(buildingStep);
  const recipeOutputQty = _getRecipeOutputQty(buildingStep);
  const byProducts = buildingStep.outputs.filter(output => output.byProduct);
  byProducts.forEach(byProduct => {
    byProduct.qty = (byProduct.recipeQty / recipeOutputQty) * totalOutput;
  });
  // TODO
};

const _setByProduct = buildingStep => {
  const oldByProducts = buildingStep.outputs.filter(output => output.byProduct);
  oldByProducts.forEach(byProduct => {
    // Remove any connection to other buildingSteps
    if (!byProduct.buildingStep) return;
    const byProductInput = _getInput(byProduct.buildingStep, byProduct.id);
    if (!byProductInput) return;
    byProductInput.buildingSteps = byProductInput.buildingSteps.filter(
      bs => bs !== buildingStep
    );
  });
  // Remove the by-products from outputs completely and start again
  buildingStep.outputs = buildingStep.outputs.filter(output => !output.byProduct);
  if (!buildingStep.recipe) return;
  const byProductItems = buildingStep.recipe.RecipeItems.filter(
    recipeItem =>
      recipeItem.direction === "output" && recipeItem.item !== buildingStep.item
  );
  const totalOutput = _getBuildingStepOutputQty(buildingStep);
  const recipeOutputQty = _getRecipeOutputQty(buildingStep);
  const newByProducts = byProductItems.map(byProduct => ({
    byProduct: true,
    id: null,
    item: byProduct.item,
    qty: (byProduct.qty / recipeOutputQty) * totalOutput,
    recipeQty: byProduct.qty,
  }));
  buildingStep.outputs = buildingStep.outputs.concat(newByProducts);
};

const _removeBuildingStepsWithNoIO = state => {
  // Ensures each buildingStep has either an output or something attached to its inputs
  // Won't destroy top-level building steps
  let updatedState = [...state];
  const topLevelSteps = _findTopLevelSteps(updatedState);
  // console.log("top level steps", topLevelSteps);
  updatedState = updatedState.filter(buildingStep => {
    return (
      buildingStep.outputs.filter(output => output.qty && !output.byProduct).length >
        0 ||
      buildingStep.inputs.filter(input => input.buildingSteps.length > 0).length >
        0 ||
      buildingStep.userAdded
    );
  });
  if (updatedState.length !== state.length)
    updatedState = _removeBuildingStepsWithNoIO(updatedState);
  return updatedState;
};

const _getBuildingStepOutputQty = buildingStep => {
  const outputQty = buildingStep.outputs.reduce((total, output) => {
    if (output.byProduct) return total;
    return parseFloat(output.qty) + total;
  }, 0);
  return outputQty;
};

const _assignVerticalPosition = buildingStep => {
  // Two building steps that output to each other (recycled oil) are siblings
  // let sibling = null;
  const ver = buildingStep.outputs.reduce((total, output) => {
    // Check for siblings
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
    const fail = buildingStep.outputs.some(output => {
      const sibling = _getSibling(buildingStep, output);
      return output.buildingStep && !output.byProduct && !sibling;
    });
    return !fail;
  });
  return topLevelSteps;
};

const _getSibling = (buildingStep, output) => {
  const searchOutputsForBuildingStep = outputBuildingStep => {
    return outputBuildingStep.outputs.find(
      output => output.buildingStep === buildingStep && !output.byProduct
    );
  };
  if (output.buildingStep && !output.byProduct) {
    return searchOutputsForBuildingStep(output.buildingStep);
  }
  return null;
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
  updatedState = _calcPosition(updatedState);
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
  const options = {
    imported: false,
    recipe: recipe,
    item,
  };
  const newBuildingStep = _newBuildingStep(options);
  const input = _getInputByItem(newBuildingStep, buildingStep.item);
  const output = {
    buildingStep: newBuildingStep,
    id: input.id,
    qty: 0,
    type: "step",
    item: buildingStep.item,
  };
  _addOutput(buildingStep, output);
  updatedState = [...updatedState, newBuildingStep];
  updatedState = _calcPosition(updatedState);
  return updatedState;
};

const _getByProductUpstreamQty = () => {
  // Gonst ta be tricky
};

const byProductDroppedOnMap = (state, payload) => {
  let updatedState = [...state];
  const { buildingStepId, recipe, itemId } = payload;
  const buildingStep = _getBuildingStep(updatedState, buildingStepId);
  const output = _getOutputByItem(buildingStep, itemId);
  const item = _findDefaultItem(recipe);
  const options = {
    item,
    recipe,
    imported: false,
  };
  const newBuildingStep = _newBuildingStep(options);
  return updatedState;
};

const setAltOutput = (state, output, buildingStep) => {
  let updatedState = [...state];
  const { type, qty } = output;
  const existingOutput = buildingStep.outputs.find(output => output.type === type);

  if (existingOutput) {
    console.log("editting output");
    _editOutput(buildingStep, existingOutput, qty);
  } else {
    console.log("adding output");
    const output = {
      type,
      qty,
      item: buildingStep.item,
    };
    if (qty) _addOutput(buildingStep, output);
  }

  //   if (!qty) {
  //     buildingStep.outputs = buildingStep.outputs.filter(
  //       output => output.type !== type
  //     );
  //   } else {
  //     existingOutput.qty = qty;
  //   }
  // } else {
  //   buildingStep.outputs.push({ type, qty: qty || 0, item: buildingStep.item });
  // }
  // _setInputQtys(buildingStep);
  updatedState = _removeBuildingStepsWithNoIO(updatedState);
  return updatedState;
};

const setOutputQty = (state, buildingStep, output, qty) => {
  let updatedState = [...state];
  console.log("setting output qty", buildingStep, output, qty);
  _editOutput(buildingStep, output, qty);
  updatedState = _removeBuildingStepsWithNoIO(updatedState);
  return updatedState;
};

const inputDroppedOnBuildingStep = (state, buildingStep, inputData) => {
  // Update a child buildingStep with a new or adjusted output to correctly supply the parent input with correct amount of materials

  // Qty should never go below zero

  // If input has a surplus and there is already a connection then the buildingStep should reduce its qty to match

  let updatedState = [...state];
  // see if connection exists already between the input and buildingStep
  const parentBuildingStep = _getBuildingStep(updatedState, inputData.buildingStep);
  const input = _getInput(parentBuildingStep, inputData.inputId);
  const existingOutput = buildingStep.outputs.find(output => output.id === input.id);
  const qty = input.qty - _getInputSuppliedQty(input);
  if (existingOutput) {
    // if it does then
    _editOutput(buildingStep, existingOutput, qty + existingOutput.qty);
  } else {
    const output = {
      id: input.id,
      buildingStep: parentBuildingStep,
      qty,
      item: input.item,
      type: "step",
    };
    _addOutput(buildingStep, output);
  }
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
  updatedState = _calcPosition(updatedState);
  return updatedState;
};

const setRecipe = (state, buildingStep, options) => {
  let updatedState = [...state];
  if (buildingStep.recipes < 1) {
    // No recipes available - ignore step??? - what are the follow-ons from here
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
        validOutput = {
          type: "step",
          item: input.item,
          buildingStep,
          id: input.id,
          qty: input.qty,
        };
        _addOutput(validBuildingStep, validOutput);
      } else {
        const remainingQty =
          input.qty - (_getInputSuppliedQty(input) - validOutput.qty);
        _editOutput(validBuildingStep, validOutput, remainingQty);
      }
    } else {
      const output = {
        type: "step",
        qty: input.qty,
        item: input.item,
        buildingStep,
        id: input.id,
      };
      const options = { output, imported: true, item: input.item };
      const newBuildingStep = _newBuildingStep(options);
      updatedState = [...updatedState, newBuildingStep];
    }
  });
  updatedState = _calcPosition(updatedState);
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
      return setOutputQty(state, buildingStep, output, qty);
    case INPUT_DROPPED_ON_BUILDINGSTEP:
      return inputDroppedOnBuildingStep(state, buildingStep, inputData);
    case BYPRODUCT_DROPPED_ON_MAP:
      return byProductDroppedOnMap(state, payload);
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
