import { BaseResourceBuilder, type BaseResourceConfig } from "./base";
import { executeBST } from "./bst/execute";
import { type BSTNode, type BSTOptionNode, BSTType } from "./bst/nodes";
import { Scope } from "./bst/scope";

type ExerciseResourceConfig<Seed> = Omit<BaseResourceConfig, "type"> & {
  exampleSeed: Seed;
  randomSeedPlan: BSTNode | BSTNode[] | BSTNode[][];
  options: Record<string, BSTOptionNode>;
  solutionPlan: Record<string, BSTNode>;
  uiPlan: BSTNode | BSTNode[];
};

export type OptionValues = Record<string, any>;

export class ExerciseResourceBuilder<Seed = any> extends BaseResourceBuilder {
  public exampleSeed!: Seed;
  public randomSeedPlan!: ExerciseResourceConfig<Seed>["randomSeedPlan"];
  public options!: ExerciseResourceConfig<Seed>["options"];
  public solutionPlan!: ExerciseResourceConfig<Seed>["solutionPlan"];
  public uiPlan!: ExerciseResourceConfig<Seed>["uiPlan"];
  constructor(config: ExerciseResourceConfig<Seed>) {
    super({ ...config, type: "exercise" });
    Object.assign(this, config);
  }
  getAllInputIds() {
    return this.#extractInputsIds(this.uiPlan);
  }
  #extractInputsIds(node: BSTNode | BSTNode[]): string[] {
    if (
      typeof node === "string" ||
      typeof node === "number" ||
      typeof node === "boolean"
    )
      return [];

    if (Array.isArray(node))
      return node.flatMap((n) => this.#extractInputsIds(n));

    switch (node._bsttype) {
      case BSTType.CodeIf:
        return [
          ...this.#extractInputsIds(node.fail),
          ...this.#extractInputsIds(node.success),
        ];
      case BSTType.UIParagraph:
        return node.items.flatMap((n) => this.#extractInputsIds(n));
      case BSTType.UINumberInput:
        return [node.id];
    }
    return [];
  }
  generateRandomSeed(ctx: Scope = new Scope()) {
    return executeBST(this.randomSeedPlan, ctx);
  }
  generateUI(ctx: Scope) {
    return executeBST(this.uiPlan, ctx);
  }
  #applyOptionValuesToCtx(ctx: Scope, optionValues: OptionValues = {}) {
    for (const [id, value] of Object.entries(optionValues)) {
      ctx.setVariable(id, value);
    }
  }
  generateExercise(optionValues?: OptionValues) {
    const ctx = new Scope();
    this.#applyOptionValuesToCtx(ctx, optionValues);
    const seed = this.generateRandomSeed(ctx);
    ctx.setVariable("seed", seed);
    const ui = this.generateUI(ctx);
    return {
      seed,
      ui,
    };
  }
  solve(seed: unknown, inputValues: Record<string, any>) {
    const ctx = new Scope({ ...inputValues, seed });
    return executeBST(this.solutionPlan, ctx);
  }
  correct(seed: unknown, inputs: Record<string, any>) {
    const res = this.solve(seed, inputs);
    const correctionObj: Record<string, boolean> = {};
    for (const [inputId, inputValue] of Object.entries(res)) {
      correctionObj[inputId] = Number(inputValue) === inputs[inputId];
    }
    return correctionObj;
  }
  build() {
    return {
      ...super.build(),
      options: this.options,
    };
  }
}

export type BuiltExerciseResource = ReturnType<
  ExerciseResourceBuilder["build"]
>;
