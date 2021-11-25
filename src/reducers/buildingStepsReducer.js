import { v4 as uuidv4 } from "uuid";

export const ADD_NEW_ITEM = "ADD_NEW_ITEM";
export const SET_ALT_OUTPUT = "SET_ALT_OUTPUT";
export const SET_RECIPE = "SET_RECIPE";
export const SET_IMPORTED = "SET_IMPORTED";
export const AUTO_BUILD_LAYER = "AUTO_BUILD_LAYER";
export const SET_OUTPUT_QTY = "SET_OUTPUT_QTY";

const addNewItem = (state, output, options) => {
  let updatedState = [...state];
  updatedState = _addOutput(updatedState, output, options);
  updatedState = _calcSuppliedQty(updatedState);
  updatedState.forEach(bs => {});
  updatedState = calcPosition(updatedState);
  return updatedState;
};

const _addOutput = (state, output, options) => {
  let updatedState = [...state];
  let currentBuildingStep;
  if (options?.buildingStep) {
    currentBuildingStep = options.buildingStep;
  } else if (!options?.newBuildingStep) {
    currentBuildingStep = updatedState.find(bs => bs.item === output.item);
  }
  // If there is a buildingStep that already manufactures the item in question:
  if (currentBuildingStep) {
    const existingOutput = currentBuildingStep.outputs.find(
      existingOutput =>
        existingOutput.type === output.type &&
        existingOutput.buildingStep === output.buildingStep
    );
    if (existingOutput) {
      existingOutput.qty = parseFloat(output.qty) + parseFloat(existingOutput.qty);
    } else {
      currentBuildingStep.outputs.push(output);
      linkInputs(currentBuildingStep, output);
    }
    setBuilding(currentBuildingStep);
    setInputs(currentBuildingStep);
    setByProduct(currentBuildingStep);
  }
  // No buidlingStep manufacturing this item in existance:
  else {
    currentBuildingStep = newBuildingStep(output);
    if (options?.hor) {
      currentBuildingStep.hor = options.hor;
    }
    updatedState.push(currentBuildingStep);
  }
  return updatedState;
};

const editOutput = (state, buildingStep, output, options) => {
  let updatedState = [...state];
};

const assignVerticalPosition = buildingStep => {
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
      if (!sibling) assignVerticalPosition(inputBuildingStep);
    });
  });
};

const calcPosition = updatedState => {
  // Get the top level steps - they should not contain outputs with buildingSteps
  // Can include a byProduct output with buildingStep
  // Can include output with sibling input step
  updatedState
    .filter(
      buildingStep =>
        !buildingStep.outputs.some(output => {
          const sibling = output.buildingStep?.inputs.find(
            input => input.id === output.id
          );
          return output.buildingStep && !output.byProduct && !sibling;
        })
    )
    // With top level items found
    .forEach(buildingStep => {
      assignVerticalPosition(buildingStep);
    });
  // Create object with rows as properties
  // Each row contains array of buildingSteps on that vertically positioned row
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

const newBuildingStep = output => {
  if (!output?.item) return null;
  const { item } = output;
  const buildingStep = {
    id: uuidv4(),
    item,
    inputs: [],
    outputs: [output],
    imported: true,
    recipes: item.recipes,
  };
  if (output.buildingStep) {
    linkInputs(buildingStep, output);
  }
  return buildingStep;
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
  setBuilding(buildingStep);
  setInputs(buildingStep);
  setByProduct(buildingStep);

  updatedState = removeBuildingStepsWithNoOutput(updatedState);
  return updatedState;
};

const setImported = (state, buildingStep, toggle) => {
  let updatedState = [...state];
  buildingStep.imported = toggle;
  setRecipe(state, buildingStep);
  setInputs(buildingStep);
  // setByProduct(buildingStep);
  updatedState = removeBuildingStepsWithNoOutput(updatedState);
  updatedState = _calcSuppliedQty(updatedState);
  updatedState = calcPosition(updatedState);
  return updatedState;
};

const removeBuildingStepsWithNoOutput = state => {
  let updatedState = [...state];
  updatedState = updatedState.filter(
    buildingStep =>
      buildingStep.outputs.filter(output => output.qty && !output.byProduct).length >
      0
  );
  return updatedState;
};

const autoBuildLayer = (state, buildingStep) => {
  let updatedState = [...state];
  // Check for inputs length
  if (buildingStep.inputs.length < 1) return;
  // const initialState = [...buildingSteps];
  // let newState = [...prevState.current];
  // Loop through each input
  buildingStep.inputs.forEach(input => {
    // Check within the previous state for any building steps already producing the input item
    const validBuildingStep = updatedState.find(bs => bs.item === input.item);
    if (validBuildingStep) {
      let validOutput = validBuildingStep.outputs.find(
        output => output.buildingStep === buildingStep && !output.byProduct
      );
      if (!validOutput) {
        validOutput = {
          type: "step",
          item: input.item,
          buildingStep,
          qty: input.qty,
        };
        updatedState = _addOutput(updatedState, validOutput, validBuildingStep);
      } else {
        const remainingQty = input.qty - (getInputTotalQty(input) - validOutput.qty);
        validOutput.qty = remainingQty;
      }
    } else {
      const output = {
        type: "step",
        qty: input.qty,
        item: input.item,
        buildingStep,
      };
      const currentBuildingStep = newBuildingStep(output);
      updatedState = [...updatedState, currentBuildingStep];
    }
    // setSuppliedInputQty(input);
  });
  // newState = setByProduct(newState);
  updatedState = _calcSuppliedQty(updatedState);
  updatedState = calcPosition(updatedState);
  return updatedState;
};

const setBuilding = buildingStep => {
  if (!buildingStep.recipe) {
    buildingStep.building = null;
    buildingStep.buildingCount = null;
    return;
  }
  buildingStep.building = buildingStep.recipe.building;
  buildingStep.buildingCount =
    getBuildingStepOutputQty(buildingStep) / getRecipeOutputQty(buildingStep);
};

const removeAllInputs = buildingStep => {
  buildingStep.inputs.forEach(input => {
    input.buildingSteps.forEach(bs => {
      bs.outputs = bs.outputs.filter(output => output.buildingStep !== buildingStep);
    });
  });
  buildingStep.inputs = [];
};

const setInputs = (buildingStep, recursionTracker = []) => {
  if (!buildingStep.recipe) {
    removeAllInputs(buildingStep);
    return;
  }
  const inputs = buildingStep.recipe.RecipeItems.filter(
    recipeItem => recipeItem.direction === "input"
  ).map(recipeItem => {
    let currentInput;
    // Loop through the items required to make this recipe
    // For each item, check if a similar input already exists
    // If so, adjust the qty and recipeQty
    const existingInput = buildingStep.inputs.find(
      input => input.item === recipeItem.item
    );
    if (existingInput) {
      currentInput = existingInput;
    } else {
      currentInput = {
        buildingSteps: [],
        item: recipeItem.item,
        id: uuidv4(),
      };
    }
    return {
      ...currentInput,
      qty: buildingStep.buildingCount * recipeItem.qty,
      recipeQty: recipeItem.qty,
    };
  });
  const prevAndNewInputs = buildingStep.inputs
    .filter(input => !inputs.includes(input))
    .concat(inputs);
  buildingStep.inputs = inputs;
  prevAndNewInputs.forEach(input => {
    input.buildingSteps.forEach(bs => {
      updateOutputs(bs);
      // if (!recursionTracker.includes(bs)) {
      //   recursionTracker.push(bs);

      // }
    });
    // setSuppliedInputQty(input);
  });
};

// const setSuppliedInputQty = input => {
//   // console.log("running set supplied input qty", input);
//   input.suppliedQty = input.buildingSteps.reduce((total, inputBuildingStep) => {
//     const output = inputBuildingStep.outputs.find(output => output.id === input.id);
//     // console.log("supplied input qty function - output", output);
//     if (output) {
//       return output.qty + total;
//     } else {
//       return total;
//     }
//   }, 0);
// };

const updateOutputs = (buildingStep, recursionTracker = []) => {
  // Go through each output and look for
  buildingStep.outputs.forEach(output => {
    if (output.id && !output.byProduct && output.buildingStep) {
      const input = output.buildingStep.inputs.find(input => input.id === output.id);
      if (input) {
        output.qty = input.qty - (getInputTotalQty(input) - output.qty);
      } else {
        output.qty = 0;
      }
    }
  });
  setBuilding(buildingStep);
  setInputs(buildingStep, recursionTracker);
  setByProduct(buildingStep);
};

const linkInputs = (buildingStep, output) => {
  if (!output.buildingStep) return;

  const input = output.buildingStep.inputs.find(input => {
    // console.log("input item", input.item);
    // console.log("output item", output.item);
    return input.item === output.item;
  });
  output.id = input.id;
  input.buildingSteps.push(buildingStep);
};

const getRecipeOutputQty = buildingStep => {
  const recipeItem = buildingStep.recipe.RecipeItems.find(
    recipeItem => recipeItem.item === buildingStep.item
  );
  return recipeItem.qty;
};

const getInputTotalQty = input => {
  // Get the amount of items currently being sent to this building step's input
  return input.buildingSteps.reduce((total, bs) => {
    return (
      total +
      bs.outputs.reduce(
        (total, output) =>
          output.id === input.id ? parseFloat(output.qty) + total : total,
        0
      )
    );
  }, 0);
};

const setAltOutput = (state, options) => {
  if (!options) return;

  const { type, buildingStep, qty } = options;
  if (!["store", "sink"].includes(type)) return console.log("incorrect type");
  if (!type || !buildingStep) return;
  const updatedState = [...state];
  const existingOutput = buildingStep.outputs.find(output => output.type === type);
  if (existingOutput) {
    if (!qty) {
      buildingStep.outputs = buildingStep.outputs.filter(
        output => output.type !== type
      );
    } else {
      existingOutput.qty = qty;
    }
  } else {
    buildingStep.outputs.push({ type, qty: qty || 0, item: buildingStep.item });
  }
  setBuilding(buildingStep);
  setInputs(buildingStep);
  return updatedState;
};

const setByProduct = buildingStep => {
  if (!buildingStep) return;
  if (!buildingStep.recipe) {
    // remove byProduct
    const byProducts = buildingStep.outputs.filter(output => output.byProduct);
    // Remove buildingStep from related input
    byProducts.forEach(byProduct => {
      if (!byProduct.buildingStep) return;
      byProduct.buildingStep.inputs
        .find(input => input.id === byProduct.id)
        .buildingSteps.filter(bs => bs !== buildingStep);
    });
  } else {
    // work out what the by-products should be
    const byProductItems = buildingStep.recipe.RecipeItems.filter(
      recipeItem =>
        recipeItem.direction === "output" && recipeItem.item !== buildingStep.item
    );
    const newByProducts = byProductItems.reduce((total, byProduct) => {
      // find an existing instance of the by product and edit
      const existingByProduct = buildingStep.outputs.find(
        output => output.byProduct && output.item === byProduct.item
      );
      const qty = buildingStep.buildingCount * byProduct.qty;
      if (existingByProduct) {
        // edit existing by product
        existingByProduct.qty = qty;
        return total;
      } else {
        // or no existing instance and create new output
        return total.concat({
          byProduct: true,
          id: null,
          item: byProduct.item,
          qty,
        });
      }
    }, []);
    buildingStep.outputs = buildingStep.outputs.concat(newByProducts);
    removeRedundantByProducts(buildingStep, newByProducts);
  }
};

const removeRedundantByProducts = (buildingStep, requiredByProducts) => {
  // Takes an array of byProduct outputs that are still relevant
  const redundantByProducts = buildingStep.outputs.filter(
    output => output.byProduct && !requiredByProducts.includes(output)
  );
  redundantByProducts.forEach(byProduct => {
    if (byProduct.buildingStep) {
      const relatedInput = byProduct.buildingStep.inputs.find(
        input => input.id === byProduct.id
      );
      relatedInput.buildingSteps = relatedInput.buildingSteps.filter(
        bs => bs !== buildingStep
      );
    }
  });
  buildingStep.outputs = buildingStep.outputs.filter(
    output => !redundantByProducts.includes(output)
  );
};

const getBuildingStepOutputQty = buildingStep => {
  const outputQty = buildingStep.outputs.reduce((total, output) => {
    if (output.byProduct) return total;
    return parseFloat(output.qty) + total;
  }, 0);
  // console.log("building step output qty", outputQty);
  return outputQty;
};

const _calcSuppliedQty = updatedState => {
  const newState = [...updatedState];
  newState.forEach(buildingStep => {
    buildingStep.inputs.forEach(input => {
      input.buildingSteps.reduce((total, bs) => {
        const relatedOutput = bs.outputs.find(output => output.id === input.id);
        if (!relatedOutput) {
          console.log(
            "error finding related input when calculating supplied input qty"
          );
          return total;
        }
        return total + parseFloat(relatedOutput);
      }, 0);
    });
  });
  return newState;
};

const setOutputQty = (state, buildingStep, output, qty) => {
  const updatedState = [...state];
  output.qty = qty;
  setBuilding(buildingStep);
  setInputs(buildingStep);
  return updatedState;
};

// const highlightOutputs = () => {};

// const highlightInputs = () => {};

const reducer = (state, action) => {
  const { type, payload } = action;
  const { buildingStep, output, toggle, options, qty } = payload;
  switch (type) {
    case ADD_NEW_ITEM:
      return addNewItem(state, output, options);
    case SET_ALT_OUTPUT:
      return setAltOutput(state, payload);
    case SET_IMPORTED:
      return setImported(state, buildingStep, toggle);
    case SET_RECIPE:
      return setRecipe(state, buildingStep, options);
    case AUTO_BUILD_LAYER:
      return autoBuildLayer(state, buildingStep);
    case SET_OUTPUT_QTY:
      return setOutputQty(state, buildingStep, output, qty);
    default:
      return state;
  }
};

export default reducer;
