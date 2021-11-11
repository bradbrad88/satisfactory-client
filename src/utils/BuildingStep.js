const getRecipeInputQty = (item, recipeInputs) => {
  if (!recipeInputs) {
    return;
  }
  const recipeInput = recipeInputs.find(
    recipeInput => parseInt(recipeInput.itemId) === parseInt(item.itemId)
  );
  if (!recipeInput)
    return console.error(
      "Error trying to find recipe input quantity in FactoryBuilder.js - getRecipeInputQty function line 72"
    );
  return recipeInput.qty;
};

class BuildingStep {
  constructor(item) {
    this.item = item;
    this.recipes = item.recipes || [];
    this.recipe = null;
    this.building = null;
    this.buildingCount = null;
    this.power = null;
    this.position = null;
    this.qty = null;
    this.inputs = [];
    this.outputs = [];
  }

  initialiseStandardTree(arr) {
    if (!arr.includes(this)) arr.push(this);
    // Initial check to see if the item has a recipe available
    if (this.recipes.length > 0) {
      // If there's a recipe available then set the first (sorted by standard) as current recipe
      this.setRecipe(this.recipes[0]);
      // Create or add the inputs to a standard build step
      this.inputs.forEach(input => {
        const existingBuildingStep = arr.find(el => el.item === input.item);
        // If there is an existing building step in the array (arr) that builds the input item already then add to its output
        if (existingBuildingStep) {
          existingBuildingStep.addOutput({
            buildingStep: this,
            qty: input.qty,
            item: input.item,
            type: "step",
          });
          existingBuildingStep.updateOutputQty();
          return;
        }
        // If there is no existing building step then it needs to be created
        const buildingStep = new BuildingStep(input.item);
        buildingStep.addOutput({
          buildingStep: this,
          qty: input.qty,
          item: input.item,
          type: "step",
        });
        buildingStep.updateOutputQty();
        buildingStep.initialiseStandardTree(arr);
      });
    }
  }

  setRecipe(recipe) {
    if (!recipe && !recipe.RecipeItems) {
      // allow for nullable recipe
      this.recipe = null;
      this.building = null;
      this.buildingCount = null;
      this.power = null;
      return;
    }
    this.recipe = recipe;
    this.building = recipe.building;
    this.buildingCount =
      this.getTotalOutputQty() / getRecipeInputQty(this.item, recipe.RecipeItems);
    this.power = this.buildingCount * recipe.building.power;
    this.setInputs();
  }

  // Fired from setRecipe
  setInputs() {
    if (!this.recipe) {
      this.inputs.forEach(input => {
        // Go through any existing input and remove references to this build step
        input.buildingStep?.removeOutputBuildingStepReference(this);
        // Ensure inputs array is emptied
        this.inputs = [];
      });
    }
    const recipe = this.recipe;
    recipe.RecipeItems.filter(
      recipeItem => recipeItem.direction === "input"
    ).forEach(recipeItem => {
      // Calculate the qty of input
      const qty = recipeItem.qty * this.buildingCount;
      // Check to see if an input of same item type exists already
      const existingInput = this.inputs.find(
        input => input.item === recipeItem.item
      );

      if (existingInput) {
        // If input of same item type already exists then simply adjust the qty
        console.log("existing input item found");
        existingInput.qty = qty;
        if (existingInput.buildingStep)
          existingInput.buildingStep.editOutput(this, qty);
        // Need to notify the dependant building step that its parent has updated qty required
      } else {
        // If no input of same type exists then add to the array
        this.inputs.push({ item: recipeItem.item, qty, recipeQty: recipeItem.qty });
      }
    });
  }

  updateInputs() {
    if (this.recipe) {
      const buildingCount =
        this.qty / getRecipeInputQty(this.item, this.recipe.RecipeItems);
      this.buildingCount = buildingCount;

      // Go through each input and adjust the materials required for this build step
      this.inputs.forEach(input => {
        const inputQty = input.recipeQty * buildingCount;
        input.buildingStep?.editOutput(this, inputQty);
        // this.editOutput(input.buildingStep, inputQty);
      });
    }
  }

  linkInputs(buildingStep, output) {
    this.inputs = this.inputs.map(input => {
      if (input.item !== output.item) return input;
      if (input.qty !== output.qty) return input;
      return { ...input, buildingStep };
    });
  }

  addOutput(output) {
    this.outputs.push(output);
    output.buildingStep?.linkInputs(this, output);
    this.updateOutputQty();
    this.calcPosition();
  }

  // TODO - instead of buildingStep, use actual output item
  editOutput(buildingStep, qty) {
    // Edit the output array of this building step

    // Locate the existing building step in output array
    const existingOutput = this.outputs.find(
      output => output.buildingStep === buildingStep
    );
    if (!existingOutput) return;

    // Edit the quantity for this build steps output array on the correct item
    existingOutput.qty = qty;

    // Update the inputs to accommodate the new output amount
    this.updateOutputQty();
    this.calcPosition();
  }

  removeOutputBuildingStepReference(buildingStep) {
    this.outputs = this.outputs.filter(
      output => output.buildingStep !== buildingStep
    );
  }

  updateOutputQty() {
    // Get new total quantity for this build step - new inputs value relies on it
    const qty = this.getTotalOutputQty();
    this.qty = qty;
    this.updateInputs();
  }

  getTotalOutputQty() {
    const qty = this.outputs.reduce(
      (total, output) => (parseFloat(output.qty) || 0) + total,
      0
    );
    // console.log("qty", qty);
    return qty;
  }

  calcPosition() {
    const position = this.outputs.reduce((total, output) => {
      const outputPos = output.buildingStep?.position || 0;
      if (outputPos >= total) return outputPos + 1;
      return total;
    }, 0);
    if (this.position !== position) {
      this.position = position;
      this.inputs.forEach(input => {
        input.buildingStep?.calcPosition();
      });
    }
  }
}

export default BuildingStep;
