import { v4 as uuidv4 } from "uuid";

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
  constructor(item, output) {
    this.id = uuidv4();
    this.item = item;
    this.recipes = item.recipes || [];
    this.recipe = null;
    this.recipeOutputItemQty = null;
    this.building = null;
    this.buildingCount = null;
    this.power = null;
    this.position = 0;
    this.qty = null;
    this.inputs = [];
    this.outputs = [];
    this.imported = this.item.rawMaterial;
    this.locked = false;
    this.addOutput(output);
    this.calcPosition();
  }

  initialiseTree(factoryTree, options) {
    if (!factoryTree.includes(this)) factoryTree.push(this);
    // Initial check to see if the item has a recipe available
    if (this.recipes.length < 1) return;
    // If there's a recipe available then set the first (sorted by standard) as current recipe
    if (!this.recipe) this.setRecipe(options);
    // Create or add the inputs to a standard build step
    this.inputs.forEach(input => {
      const existingBuildingStep = factoryTree.find(
        buildingStep => buildingStep.item === input.item
      );
      // If there is an existing building step in the array (factoryTree) that builds the input item already then add to its output
      console.log("existing build step", existingBuildingStep);
      const output = {
        buildingStep: this,
        qty: input.qty,
        item: input.item,
        type: "step",
      };
      if (existingBuildingStep) {
        existingBuildingStep.addOutput(output);
        // existingBuildingStep.updateOutputQty();
        return;
      }
      // If there is no existing building step then it needs to be created

      const buildingStep = new BuildingStep(input.item, output);
      buildingStep.initialiseTree(factoryTree);
    });
    if (this.item.rawMaterial) {
      this.imported = true;
    }
  }

  autoBuildRecipe(factoryTree) {
    // Create a BuildingStep for each input of currently selected recipe
    if (this.recipes.length < 1) return;
    console.log("building tree start", [...factoryTree]);
    console.log("autoBuildRecipe ran", [...this.inputs]);
    this.inputs.forEach(input => {
      console.log("building tree", [...factoryTree]);
      // debugger;
      const existingBuildingStep = factoryTree.find(
        buildingStep => buildingStep.item === input.item
      );
      const output = {
        buildingStep: this,
        qty: input.qty,
        item: input.item,
        type: "step",
      };
      if (existingBuildingStep) {
        console.log("existing building step", existingBuildingStep);
        existingBuildingStep.addOutput(output);
        return;
      }
      const buildingStep = new BuildingStep(input.item, output);
      console.log("pushing to array", this);
      factoryTree.push(buildingStep);
    });
  }

  setRecipe(options) {
    // Function should handle looking at statistics and veering towards recipes that fall within raw material priorities specified in options object
    if (this.recipes.length < 1) return;
    if (options?.recipe) {
      this.recipe = options.recipe;
    } else {
      this.recipe = this.recipes[0];
    }
    if (options?.removeRecipe) this.recipe = null;
    this.recipeOutputItemQty = this.recipe
      ? getRecipeInputQty(this.item, this.recipe.RecipeItems)
      : null;
    this.setBuilding();
    this.setNewInputs();
  }

  setImported(bool) {
    this.imported = bool;
    const options = {
      removeRecipe: bool,
    };
    this.setRecipe(options);
  }

  setBuilding() {
    const { recipe } = this;
    if (!recipe) return (this.building = null);
    this.building = this.recipe.building;
    this.setBuildingCount();
  }

  setBuildingCount() {
    const { recipeOutputItemQty } = this;
    if (!recipeOutputItemQty) {
      this.buildingCount = null;
      this.power = null;
      return;
    }
    const buildingCount = this.getTotalOutputQty() / recipeOutputItemQty;
    this.buildingCount = buildingCount;
    this.power = this.buildingCount * this.recipe.building.power;
    return buildingCount;
  }

  // Fired from setRecipe
  setNewInputs() {
    const { item, recipe, buildingCount } = this;
    this.clearInputs();
    if (!recipe) return;
    recipe.RecipeItems.filter(
      recipeItem => recipeItem.direction === "input"
    ).forEach(recipeItem => {
      // For each recipe item in the currently selected recipe
      const { item } = recipeItem;
      const qty = recipeItem.qty * buildingCount;
      this.inputs.push({
        item,
        qty,
        recipeQty: recipeItem.qty,
        buildingSteps: [],
      });
    });
  }

  updateInputs() {
    const { recipe } = this;
    const buildingCount = this.setBuildingCount();
    // Building count will update buildingCount and power

    if (!recipe) return;

    // Go through each input and adjust the materials required for this build step
    this.inputs.forEach(input => {
      const inputQty = input.recipeQty * buildingCount;
      input.qty = inputQty;
      // If the input qty is 0 - don't delete everything - hold onto building steps as new user input will likely change this quickly

      // Hmmm, reconsidering - not liking the UX of things not clearing
      if (inputQty === 0) {
        input.buildingSteps.forEach(bs =>
          bs.removeOutputBuildingStepReference(this)
        );
      }

      if (input.buildingSteps.length < 1) return;
      if (input.buildingSteps.length > 1) {
        // Find the first step that isn't locked
        // Work out the total amount that all buildingSteps are providing
        const buildingStepsTotal = input.buildingSteps.reduce(
          (total, buildingStep) => {
            const buildingStepTotal = buildingStep.outputs
              .filter(output => output.buildingStep === this)
              .reduce((total, output) => total + output.qty, 0);
            return buildingStepTotal + total;
          },
          0
        );
        console.log("building steps total", buildingStepsTotal);
        // If in deficit then add to an unlocked step

        // If in surplus then loop through all unlocked building steps and remove the necessary amount
        // Ensure updating their inputs at same time

        // Reduce function where initial total set to surplus
      } else {
        input.buildingSteps[0].editOutput(this, inputQty);
        // input.buildingSteps[0].updateInputs();
      }
    });
  }

  linkInputs(buildingStep) {
    // This - should currently be in the parent
    // Child calls this function on output
    // buildingStep is child
    const input = this.inputs.find(input => input.item === buildingStep.item);
    if (!input)
      return console.log("Error finding matching item when linking input/output");
    if (input.buildingSteps.includes(buildingStep)) return;
    if (!buildingStep) return;
    input.buildingSteps.push(buildingStep);
  }

  clearInputs() {
    this.inputs.forEach(input => {
      input.buildingSteps.forEach(bs => bs.removeOutputBuildingStepReference(this));
    });
    this.inputs = [];
  }

  removeOutputBuildingStepReference(buildingStep) {
    // buildingStep references the parent - this function is called by the parent on the input child
    // this - currently refers to child input
    this.outputs = this.outputs.filter(
      output => output.buildingStep !== buildingStep
    );
    this.updateInputs();
  }

  addOutput(output) {
    this.outputs.push(output);
    output.buildingStep?.linkInputs(this, output);
    if (!this.imported) this.updateInputs();
    this.calcPosition();
  }

  // TODO - instead of buildingStep, use actual output item
  editOutput(buildingStep, qty) {
    // Edit the output array of this building step
    if (buildingStep.item.itemName === "Cable") {
      console.log("cable building step", buildingStep, qty);
    }
    if (this.item.itemName === "Cable") {
      console.log("cable building step", this);
    }
    // Locate the existing building step in output array
    const existingOutput = this.outputs.find(
      output => output.buildingStep === buildingStep
    );
    if (!existingOutput) return;

    // Edit the quantity for this build steps output array on the correct item
    existingOutput.qty = qty;
    this.updateInputs();
    this.calcPosition();
  }

  updateOutputQty() {
    // Get new total quantity for this build step - new inputs value relies on it
    // const qty = this.getTotalOutputQty();
    // this.qty = qty;
    // this.updateInputs();
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
    console.log("starting calc position");
    const position = this.outputs.reduce((total, output) => {
      const outputPos = output.buildingStep?.position || 0;
      if (outputPos >= total) return outputPos + 1;
      return total;
    }, 0);

    this.position = position;
    this.inputs.forEach(input => {
      input.buildingSteps.forEach(buildingStep => {
        buildingStep.calcPosition();
      });
    });
  }
}

export default BuildingStep;
