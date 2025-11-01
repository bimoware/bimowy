import { CircleAlertIcon } from "lucide-react";
import { useContext } from "react";
import { LatexProvider, LatexText } from "@/cpn/main/Latex";
import { NumberInput } from "@/cpn/main/number-input";
import { type BSTNode, BSTType } from "@/lib/resources";
import type { BSTNUIumberInputNode } from "@/lib/resources/builders/bst/nodes/number-input";
import type { BSTUIParagraphNode } from "@/lib/resources/builders/bst/nodes/paragraph";
import type { BSTUITextNode } from "@/lib/resources/builders/bst/nodes/text";
import { ExerciseContext, ExerciseState } from "./store";

export function UIElements() {
  const store = useContext(ExerciseContext)!;
  const node = store((state) => state.getCurrentExercise().data.ui);

  return <UIElementRenderer {...{ node }} />;
}

function UIElementRenderer({ node }: { node: BSTNode }) {
  if (
    typeof node === "string" ||
    typeof node === "number" ||
    typeof node === "boolean"
  )
    return node;
  if (Array.isArray(node))
    return node.map((node, i) => <UIElementRenderer key={i} {...{ node }} />);
  if (!("_bsttype" in node)) {
    return <div>Invalid node</div>;
  }
  switch (node._bsttype) {
    case BSTType.CodeObject:
      return;
    case BSTType.UISuperText:
      return <TextNode {...{ node }} />;
    case BSTType.UIParagraph:
      return <ParagraphNode {...{ node }} />;
    case BSTType.UINumberInput:
      return <NumberInputNode {...{ node }} />;
    default:
      return (
        <CircleAlertIcon
          className="h-[0.9rem] text-shadow-md text-shadow-red-500"
          stroke="red"
        />
      );
  }
}

function TextNode({ node }: { node: BSTUITextNode }) {
  const elem = <UIElementRenderer node={node.text} />;
  return (
    <span>
      <LatexText key={node.text as string}>{elem}</LatexText>
    </span>
  );
}

function ParagraphNode({ node }: { node: BSTUIParagraphNode }) {
  const items = node.items as BSTNode[];
  return (
    <LatexProvider>
      <div className="p-2 flex gap-2 flex-wrap items-center **:text-2xl">
        {items.map((node, i) => (
          <UIElementRenderer key={i} {...{ node }} />
        ))}
      </div>
    </LatexProvider>
  );
}

function NumberInputNode({ node }: { node: BSTNUIumberInputNode }) {
  const store = useContext(ExerciseContext)!;
  const [
    index,
    exerciseState,
    initExerciseInputRef,
    correction,
    inputValue,
    setCurrentExerciseInputValue,
  ] = [
      store((state) => state.currentIndex),
      store((state) => state.getCurrentExercise().state),
      store((state) => state.initExerciseInputRef),
      store((state) => state.getCurrentExercise().inputs[node.id]?.correction),
      store((state) => state.getCurrentExercise().inputs[node.id]?.value),
      store((state) => state.setCurrentExerciseInputValue),
    ];

  const disabled =
    exerciseState !== ExerciseState.OnGoing ||
    (correction?.corrected && correction.correct);

  return (
    <NumberInput
      allowNothing
      className="data-[correct=correct]:ring-green-400/50 data-[correct=correct]:!bg-green-400/10
       data-[correct=incorrect]:ring-red-400/50 data-[correct=incorrect]:!bg-red-400/10
       data-[correct]:ring-2
       duration-75"
      control={{
        onNewValue: (newValue) => {
          setCurrentExerciseInputValue(node.id, `${newValue}`);
        },
        value: inputValue,
      }}
      data-correct={
        !correction?.corrected
          ? "?"
          : correction.correct
            ? "correct"
            : "incorrect"
      }
      disabled={disabled}
      id={`${index}-${node.id}`}
      key={`${index}-${node.id}`}
      ref={(el: HTMLInputElement | null) => {
        if (el) initExerciseInputRef(node.id, el);
      }}
    />
  );
}
