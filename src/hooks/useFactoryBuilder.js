import Building from "components/elements/fields/Building";
import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import useData from "./useData";

const useFactoryBuilder = () => {
  const [buildingSteps, setBuildingSteps] = useState([]);
  const { items } = useData();

  const getBuildingStepOutputQty = useCallback(buildingStep => {
    const outputQty = buildingStep.outputs.reduce((total, output) => {
      if (output.byProduct) return total;
      return parseFloat(output.qty) + total;
    }, 0);
    console.log("building step output qty", outputQty);
    return outputQty;
  }, []);
  const prevState = useRef();
  useEffect(() => {
    prevState.current = buildingSteps;
  }, [buildingSteps]);

  const factoryTotals = useMemo(() => {
    console.log("factory totals building steps", [...buildingSteps]);
    const breakdown = buildingSteps.reduce(
      (total, buildingStep) => {
        const newTotal = { ...total };
        const outputs = buildingStep.outputs.reduce((outputTotal, output) => {
          const { item, qty, type } = output;
          const newTotal = { ...outputTotal };
          const arr = newTotal[type] || [];
          // TODO - look for existing item here and add to it
          arr.push({ item, qty });
          newTotal[type] = arr;
          return newTotal;
        }, {});
        if (buildingStep.item.rawMaterial) {
          newTotal.inputs.rawMaterials = newTotal.inputs.rawMaterials || [];
          newTotal.inputs.rawMaterials.push({
            item: buildingStep.item,
            qty: getBuildingStepOutputQty(buildingStep),
          });
        } else if (buildingStep.imported) {
          newTotal.inputs.imported = newTotal.inputs.imported || [];
          newTotal.inputs.imported.push({
            item: buildingStep.item,
            qty: getBuildingStepOutputQty(buildingStep),
          });
        } else {
        }

        // see if newwTotal.ouputs already exists
        Object.keys(outputs).forEach(key => {
          const arr = outputs[key] || [];
          const existingArr = newTotal.outputs[key] || [];
          newTotal.outputs[key] = [...existingArr, ...arr];
        });
        return newTotal;
      },
      { inputs: {}, outputs: {} }
    );
    return breakdown;
  }, [buildingSteps]);

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
    // reduce buildingSteps state down to steps that don't contain outputs with buildingSteps
    const topLayerBuildingSteps = updatedState
      .filter(
        buildingStep =>
          !buildingStep.outputs.some(
            output => output.buildingStep && !output.byProduct
          )
      )
      .forEach(buildingStep => {
        assignVerticalPosition(buildingStep);
      });
    return updatedState;
    // Ie anything going to store or sink
    // Should not count outputs produced from by-products as by-product can be re-circulated to child steps
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

  const addOutput = (updatedState, output, buildingStep) => {
    // let newState = [...prevState.current];
    if (!updatedState) updatedState = [...prevState.current];
    console.log("updated state", updatedState);
    let currentBuildingStep;
    if (buildingStep) {
      currentBuildingStep = buildingStep;
    } else {
      currentBuildingStep = updatedState.find(bs => bs.item === output.item);
    }

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
    } else {
      currentBuildingStep = newBuildingStep(output);
      updatedState.push(currentBuildingStep);
    }
    return updatedState;
  };

  const addNewItem = output => {
    let updatedState = [...prevState.current];
    updatedState = addOutput(updatedState, output);
    updatedState = calcPosition(updatedState);
    setBuildingSteps(updatedState);
  };

  const setRecipe = (buildingStep, options) => {
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
    setBuildingSteps([...buildingSteps]);
  };

  const setImported = (buildingStep, toggle) => {
    const newBuildingSteps = [...prevState.current];
    buildingStep.imported = toggle;
    setRecipe(buildingStep);
    console.log("before removal", [...newBuildingSteps]);
    const newState = removeBuildingStepsWithNoOutput(newBuildingSteps);
    console.log("after removal", [...newState]);
    setBuildingSteps(newState);
  };

  const removeBuildingStepsWithNoOutput = updatedBuildingSteps => {
    const newState = [...updatedBuildingSteps];
    const filteredState = newState.filter(
      buildingStep => buildingStep.outputs.length > 0
    );
    return filteredState;
  };

  const autoBuildInputs = buildingStep => {
    // Check for inputs length
    if (buildingStep.inputs.length < 1) return;
    // const initialState = [...buildingSteps];
    let newState = [...prevState.current];
    // Loop through each input
    buildingStep.inputs.forEach(input => {
      // Check within the previous state for any building steps already producing the input item
      const validBuildingStep = newState.find(bs => bs.item === input.item);

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
          newState = addOutput(newState, validOutput, validBuildingStep);
        } else {
          const remainingQty =
            input.qty - (getInputTotalQty(buildingStep, input) - validOutput.qty);
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
        newState = [...newState, currentBuildingStep];
        // newBuildingSteps.push(currentBuildingStep);
      }
    });
    newState = calcPosition(newState);
    setBuildingSteps(newState);
    // See if input.buildingSteps > 0
    // // Adjust the qty of associated buildingStep output
    // Else
    // See if buildingStep exists that makes input.item
    // If it does
    // // Add an output to this buildingStep
    // If not
    // // Create new buildingStep

    // Calc Positions after loop
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
        bs.outputs = bs.outputs.filter(
          output => output.buildingStep !== buildingStep
        );
      });
    });
    buildingStep.inputs = [];
  };

  const setInputs = buildingStep => {
    if (!buildingStep.recipe) {
      // remove all inputs
      removeAllInputs(buildingStep);
      return;
    }
    const inputs = buildingStep.recipe.RecipeItems.filter(
      recipeItem => recipeItem.direction === "input"
    ).map(recipeItem => {
      let currentInput = {};
      // Loop through the items required to make this recipe
      // For each item, check if a similar input already exists
      // If so, adjust the qty and recipeQty
      const existingInput = buildingStep.inputs.find(
        input => input.item === recipeItem.item
      );
      if (existingInput) {
        currentInput = existingInput;
        // existingInput.qty = buildingStep.buildingCount * recipeItem.qty
      } else {
        currentInput = {
          buildingSteps: [],
          item: recipeItem.item,
        };
      }
      return {
        ...currentInput,
        qty: buildingStep.buildingCount * recipeItem.qty,
        recipeQty: recipeItem.qty,
      };
    });
    buildingStep.inputs = inputs;
  };

  const linkInputs = (buildingStep, output) => {
    if (!output.buildingStep) return;
    const input = output.buildingStep.inputs.find(
      input => input.item === output.item
    );
    input.buildingSteps.push(buildingStep);
  };

  const getRecipeOutputQty = buildingStep => {
    const recipeItem = buildingStep.recipe.RecipeItems.find(
      recipeItem => recipeItem.item === buildingStep.item
    );
    console.log("recipe output qty", recipeItem.qty);
    return recipeItem.qty;
  };

  const getInputTotalQty = (buildingStep, input) => {
    // Get the amount of items currently being sent to this building step's input
    return input.buildingSteps.reduce((total, bs) => {
      return (
        total +
        bs.outputs.reduce(
          (total, output) =>
            output.buildingStep === buildingStep
              ? parseFloat(output.qty) + total
              : total,
          0
        )
      );
    }, 0);
  };

  return {
    items,
    buildingSteps,
    factoryTotals,
    addNewItem,
    addOutput,
    setRecipe,
    setImported,
    autoBuildInputs,
  };
};

export default useFactoryBuilder;
