import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCheckIcon,
  FlagIcon,
  LogOutIcon,
  PlayIcon,
  PlusIcon,
  RotateCcwIcon,
  UndoIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { type HTMLAttributes, type ReactNode, useContext } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/cpn/main/button";
import { Spinner } from "@/cpn/ui/spinner";
import { ExerciseContext, ExerciseState, PageState } from "./store";

const strokeWidth = 3;

export function BottomBar() {
  return (
    <div
      className="p-3
    flex items-center justify-between flex-wrap gap-3"
    >
      <LeftBottomBar />
      <RightBottomBar />
    </div>
  );
}

function LeftBottomBar() {
  const store = useContext(ExerciseContext)!;
  const [time, exercises, currentIndex, pageState, exercise] = [
    store((state) => state.getFormattedTime()),
    store((state) => state.exercises),
    store((state) => state.currentIndex),
    store((state) => state.pageState),
    store((state) => state.getCurrentExercise()),
  ];

  return (
    <div className="flex gap-2">
      {time && <Box className="font-mono">{time}</Box>}
      {pageState !== PageState.End && (
        <>
          {
            !exercises.length
              ? null
              : <Box className="font-mono">
                {currentIndex + 1}/{exercises.length}
              </Box>
          }
          <span>
            <div className="flex gap-0.5">
              {exercises.map((e, i) => {
                const inputs = Object.values(e.inputs);
                return (
                  <button
                    className="enabled:cursor-pointer disabled:cursor-progress
                duration-75
                enabled:hover:scale-110 enabled:data-[current=true]:scale-125
                disabled:grayscale-50"
                    data-current={i === currentIndex}
                    disabled={
                      pageState === PageState.Loading ||
                      exercise.state === ExerciseState.Correcting
                    }
                    key={i}
                    onClick={(ev) => {
                      if (!ev.currentTarget.disabled)
                        store.setState({ currentIndex: i });
                    }}
                    type="button"
                  >
                    {e.state === ExerciseState.Correcting
                      ? "✒️"
                      : e.state === ExerciseState.OnGoing && i === currentIndex
                        ? "✏️"
                        : inputs.every((inp) => !inp.correction.corrected)
                          ? i === currentIndex
                            ? "⬜"
                            : "⚪"
                          : inputs.every(
                            (inp) =>
                              inp.correction.corrected &&
                              inp.correction.correct,
                          )
                            ? i === currentIndex
                              ? "🟩"
                              : "🟢"
                            : i === currentIndex
                              ? "🟥"
                              : "🔴"}
                  </button>
                );
              })}
            </div>
          </span>
        </>
      )}
    </div>
  );
}

function RightBottomBar() {
  const store = useContext(ExerciseContext)!;

  const [
    pageState,
    exercises,
    exerciseState,
    isFullyCorrect,
    isLastExercise,
    isFirstExercise,
    start,
    correct,
    previous,
    next,
    retry,
    loadNewExercise,
    end,
  ] = [
      store((state) => state.pageState),
      store((state) => state.exercises),
      store((state) => state.getCurrentExercise()?.state),
      store((state) => state.getIsCurrentExerciseFullyCorrect()),
      store((state) => state.currentIndex === state.exercises.length - 1),
      store((state) => state.currentIndex === 0),
      store((state) => state.start),
      store((state) => state.correct),
      store((state) => state.previous),
      store((state) => state.next),
      store((state) => state.retry),
      store((state) => state.loadNewExercise),
      store((state) => state.end),
    ];

  type ButtonData = {
    id: string;
    variant?: Parameters<typeof Button>[0]["variant"];
    disabled?: boolean;
    icon: any; // TODO fix
    text?: string;
    onClick?: () => void;
  } & ({ disabled: true } | { onClick?: () => void });

  const buttonsData: {
    main: ButtonData | null;
    secondary: ButtonData[];
  } = {
    main: null,
    secondary: [],
  };

  let areAllButtonsLocked = false;

  const router = useRouter();

  if (pageState === PageState.End) {
    buttonsData.main = {
      icon: RotateCcwIcon,
      id: "redo",
      onClick: () => router.refresh(),
      text: "Redo",
    };
    buttonsData.secondary = [
      {
        icon: LogOutIcon,
        id: "quit",
        onClick: () => router.back(),
        text: "Quit",
      },
    ];
  } else if (pageState === PageState.Idle) {
    buttonsData.main = {
      icon: PlayIcon,
      id: "start",
      onClick: () => start(),
      text: "Start",
    };
  } else if (
    pageState === PageState.Loading ||
    exerciseState === ExerciseState.Correcting
  ) {
    buttonsData.main = {
      disabled: true,
      icon: Spinner,
      id: "loading",
    };
    areAllButtonsLocked = true;
  } else if (exerciseState === ExerciseState.Corrected && isLastExercise) {
    if (isFullyCorrect) {
      buttonsData.main = {
        icon: PlusIcon,
        id: "add",
        onClick: () => loadNewExercise(),
        text: "Add",
      };
    } else {
      buttonsData.main = {
        icon: UndoIcon,
        id: "try-again",
        onClick: () => retry(),
        text: "Try again",
      };
    }
  } else if (exerciseState === ExerciseState.OnGoing) {
    buttonsData.main = {
      icon: CheckCheckIcon,
      id: "correct",
      onClick: () => correct(),
      text: "Correct",
    };
  }
  if (exercises.length && pageState !== PageState.End) {
    buttonsData.secondary.push({
      icon: FlagIcon,
      id: "end",
      onClick: () => end(),
      text: "End",
    });
    buttonsData.secondary.push({
      disabled: isFirstExercise,
      icon: ArrowLeftIcon,
      id: "previous",
      onClick: () => previous(),
    });
    const nextButton = {
      disabled: isLastExercise,
      icon: ArrowRightIcon,
      id: "next",
      onClick: () => next(),
    };
    if (!buttonsData.main) buttonsData.main = nextButton;
    else buttonsData.secondary.push(nextButton);
  }

  return (
    <div
      className={`flex gap-3 ${areAllButtonsLocked ? "cursor-progress" : ""}`}
    >
      {buttonsData.secondary.map((b) => (
        <BottomButton
          {...b}
          disabled={areAllButtonsLocked || b.disabled}
          key={b.id}
          variant="secondary"
        />
      ))}
      {buttonsData.main && <BottomButton {...buttonsData.main} />}
    </div>
  );
}

function BottomButton({
  id,
  variant,
  disabled,
  onClick,
  icon: Icon,
  text,
}: {
  id: string;
  variant?: Parameters<typeof Button>[0]["variant"];
  disabled?: boolean;
  onClick?: () => void;
  icon: any;
  text?: string;
}) {
  return (
    <Button
      {...{ disabled, variant }}
      id={variant ? id : "main"}
      onClick={() => !disabled && onClick?.()}
    >
      <Icon {...{ strokeWidth }} />
      {text}
    </Button>
  );
}

export function Box({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className: string;
  props?: HTMLAttributes<HTMLDivElement>;
}) {
  return (
    <div
      className={twMerge(
        className,
        `border-border border-1
        leading-none
        p-1.5 px-2 rounded-sm bg-white/5`
      )}
      {...props}
    >
      {children}
    </div>
  );
}
