import { PlaneElementEnum } from "@/cpn/widgets/plane/util";
import { ExerciseResourceBuilder } from "../builders";
import { $ } from "../builders/bst/helpers";

export default new ExerciseResourceBuilder({
  exampleSeed: [2, 1],
  id: "twodpoints",
  name: "Reading 2D Points",
  options: {
    x_interval: $.intervaloption("X Axis", [-5, 5]),
    y_interval: $.intervaloption("Y Axis", [-5, 5]),
  },
  randomSeedPlan: [
    $.fn("randomInt", $.var("x_interval")),
    $.fn("randomInt", $.var("y_interval")),
  ],
  solutionPlan: {
    x: $.i($.var("seed"), 0),
    y: $.i($.var("seed"), 1),
  },
  tags: ["2D"],
  uiPlan: [
    $.prgh([
      $.text("P", { latex: true }),
      " = (",
      $.numinp("x"),
      ", ",
      $.numinp("y"),
      ")",
    ]),
    $.widget("Plane", {
      elems: [
        {
          type: PlaneElementEnum.Point,
          // @ts-expect-error
          x: $.i($.var("seed"), 0),
          // @ts-expect-error
          y: $.i($.var("seed"), 1),
        },
      ],
      // @ts-expect-error
      ranges: { x: $.var("x_interval"), y: $.var("y_interval") },
    }),
  ],
});
