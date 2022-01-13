export const getInputDropDisplay = (buildingSteps, input) => {
  // get the input item
  const dropDisplay = buildingSteps.reduce((total, buildingStep) => {
    if (buildingStep === input.buildingStep) return total;

    // we want a distinction between buildingStep item and byProduct item as they'll be handled differently - for example, we don't want to highlight outputs unless they are a byProduct
    // with that in mind, check for buildingStep.item first
    // if that doesn't exist, find within outputs (by default this will be a by-product - could filter by byProduct to be defensive)
    // if (buildingStep.item.itemId === input.item.itemId) {
    //   // add to the object
    //   if (input) total[buildingStep.id] = true;
    //   return total;
    // }
    const output = buildingStep.outputs.find(
      output => output.item.itemId === input.item.itemId
    );
    if (output) {
      console.log("output", output, input);
      if (output.input?.buildingStep === input.buildingStep) return total;
      total[buildingStep.id] = true;
      if (output.byProduct) total[output.id] = true;
      return total;
    }
    return total;
  }, {});
  // find building steps with outputs that match this item
  // map out an object that can be used by components to highlight
  console.log("drop display", dropDisplay);

  return dropDisplay;
};

const droppingByProduct = () => {
  //
};

// used when drag starts from 'create new item upstream' handle - ie: top right corner + sign
const droppingUpstream = () => {
  //
};

// options should contain
// * either input, output
