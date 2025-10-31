import { ExerciseResourceBuilder } from "../builders";
import { $ } from "../builders/bst/helpers";

type Seed = [number];

export default new ExerciseResourceBuilder<Seed>({
  exampleSeed: [5],
  id: "factorial",
  name: "Factorial",
  randomSeedPlan: [$.fn("randomInt", [0, 5])],
  solutionPlan: $.obj({
    n: $.fn("factorial", [
      $.i($.var("seed"), 0)
    ]),
  }),
  tags: ["math"],
  uiPlan: $.prgh([
    $.concat([
      $.i($.var("seed"), 0),
      "! = "
    ]),
    $.numinp("n"),
  ]),
});
