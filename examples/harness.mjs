import {
  decide,
  fixtureFor,
  frontier,
  getRecipe,
  requestFor,
} from "../dist/index.js";

const eligible = frontier([
  { id: "design", status: "done", blockedBy: [] },
  { id: "implement", status: "open", blockedBy: ["design"] },
  { id: "release", status: "open", blockedBy: ["implement"] },
]);
const recipe = getRecipe("issue-sequencing");
const request = requestFor(recipe);
const response = fixtureFor(recipe);
console.log(
  JSON.stringify(
    {
      mode: "offline-fixture",
      eligible,
      decision: decide(
        request,
        response,
        {
          dependency_frontier: eligible.includes("implement") ? "pass" : "fail",
          tracker_revision: "unknown",
          worker_capacity: "pass",
        },
        { requiredGates: recipe.gates },
      ),
    },
    null,
    2,
  ),
);
