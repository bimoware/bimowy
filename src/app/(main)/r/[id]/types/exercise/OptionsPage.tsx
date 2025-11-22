import { InfoIcon } from "lucide-react";
import { NumberInput } from "@/cpn/main/NumberInput";
import { type BSTOptionNode, BSTType } from "@/lib/resources";
import type { BSTOptionInterval } from "@/lib/resources/builders/bst/nodes/interval-option";
import { useExerciseStore } from "./store";

export function OptionsPage() {
  const [options] = [useExerciseStore((state) => state.resource.options)];

  return (
    <div
      className={`flex flex-col justify-center items-center gap-4
    size-full text-4xl`}
    >
      {Object.entries(options).map(([id, option]) => (
        <div
          className={`flex items-center justify-center gap-4
        bg-white/5 rounded-lg
        px-5 py-3`}
          key={id}
        >
          {option.name && <h1>{option.name}: </h1>}
          <OptionRenderer {...{ id, option }} />
        </div>
      ))}
    </div>
  );
}

function OptionRenderer({ id, option }: { id: string; option: BSTOptionNode }) {
  switch (option._bsttype) {
    case BSTType.OptionInterval: {
      return <IntervalOption {...{ id, option }} />;
    }
    default:
      return <InfoIcon stroke="red" />;
  }
}

function IntervalOption({ id }: { id: string; option: BSTOptionInterval }) {
  const [optionValue, setOptionValue, defaultValue] = [
    useExerciseStore((s) => s.optionValues[id]),
    useExerciseStore((s) => s.setOptionValue),
    useExerciseStore((s) => s.resource.options[id].defaultValue),
  ];

  return (
    <div className="flex gap-1 items-center">
      <span>[</span>
      <NumberInput
        defaultValue={defaultValue[0]}
        onNewValue={(newValue) =>
          setOptionValue(id, [Number(newValue), optionValue[1]])
        }
      />
      <span>;</span>
      <NumberInput
        defaultValue={defaultValue[1]}
        onNewValue={(newValue) =>
          setOptionValue(id, [optionValue[0], Number(newValue)])
        }
      />
      <span>]</span>
    </div>
  );
}
