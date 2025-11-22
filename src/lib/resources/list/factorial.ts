import { ExerciseResourceBuilder } from "../builders";
import { $ } from "../builders/bst/helpers";

export default new ExerciseResourceBuilder({
  exampleSeed: [5],
  id: "factorial",
  name: "Factorial",
  options: {
    interval: $.intervaloption("Interval", [0, 6], { min: 0 }),
  },
  randomSeedPlan: [$.fn("randomInt", $.var("interval"))],
  solutionPlan: {
    n: $.fn("factorial", [$.i($.var("seed"), 0)]),
  },
  tags: ["arithmetic"],
  uiPlan: $.prgh([$.concat([$.i($.var("seed"), 0), "! = "]), $.numinp("n")]),
});
