import { PlaneElementEnum } from "@/cpn/widgets/plane/util";
import { ExerciseResourceBuilder } from "../builders";
import { $ } from "../builders/bst/helpers";

export default new ExerciseResourceBuilder({
  exampleSeed: [2, 1],
  id: "twodpoints",
  name: "Reading 2D Points",
  randomSeedPlan: [$.fn("randomInt", [-5, 5]), $.fn("randomInt", [-5, 5])],
  solutionPlan: $.obj({
    x: $.i($.var("seed"), 0),
    y: $.i($.var("seed"), 1),
  }),
  tags: ["math", "2D"],
  uiPlan: [
    $.prgh([
      $.text("(x,y) = (", { latex: true }),
      $.numinp("x"),
      ", ",
      $.numinp("y"),
      ")",
    ]),
    $.widget("Plane", [
      {
        elems: [
          {
            type: PlaneElementEnum.Point,
            // @ts-expect-error
            x: $.i($.var("seed"), 0),
            // @ts-expect-error
            y: $.i($.var("seed"), 1),
          },
        ],
        ranges: { x: [-5, 5], y: [-5, 5] },
      },
    ]),
  ],
});
