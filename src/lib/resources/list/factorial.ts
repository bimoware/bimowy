import { ExerciseResourceBuilder } from "../builders";
import { $ } from "../builders/bst/helpers";

export default new ExerciseResourceBuilder({
  exampleSeed: [5],
  id: "factorial",
  name: "Factorial",
  randomSeedPlan: [$.fn("randomInt", [0, 5])],
  solutionPlan: $.obj({
    n: $.fn("factorial", [$.i($.var("seed"), 0)]),
  }),
  tags: ["arithmetic"],
  uiPlan: $.prgh([$.concat([$.i($.var("seed"), 0), "! = "]), $.numinp("n")]),
});
