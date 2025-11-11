import { ExerciseResourceBuilder } from "../builders";
import { $ } from "../builders/bst/helpers";

export default new ExerciseResourceBuilder({
  exampleSeed: [5, 1],
  id: "power",
  name: "Power",
  randomSeedPlan: [$.fn("randomInt", [0, 5]), $.fn("randomInt", [0, 3])],
  solutionPlan: $.obj({
    n: $.fn("**", $.var("seed")),
  }),
  tags: ["arithmetic"],
  uiPlan: $.prgh([
    $.concat(
      ["\\(", $.i($.var("seed"), 0), "^{", $.i($.var("seed"), 1), "}\\) ="],
      { latex: true },
    ),
    $.numinp("n"),
  ]),
});
