import { createContext } from "react";
import { create } from "zustand";
import type {
  BuiltExerciseResource,
  ExerciseResourceBuilder,
} from "@/lib/resources";

export type ExerciseStoreProps = {
  resource: BuiltExerciseResource;
};

export enum ExerciseState {
  OnGoing, // Student is working on it
  Correcting, // API is getting called to correct
  Corrected, // API has answered and UI is waiting for user to click on "Retry" or "Next"
}
export enum PageState {
  Idle,
  Loading,
  OnGoing,
  End,
}

export type InputInstance = {
  ref: HTMLInputElement | null;
  value: string;
  correction:
    | {
        corrected: false;
      }
    | {
        tries: number;
        corrected: true;
        correct: boolean;
        correctOnFirstTry: boolean;
      };
};

export type ExerciseInstance = {
  data: ReturnType<ExerciseResourceBuilder["generateExercise"]>;
  inputs: Record<string, InputInstance>;
  state: ExerciseState;
};

export type ExerciseStoreActions = {
  _fetchCorrection(): Promise<Record<string, InputInstance["correction"]>>;
  _fetchNewExercise(): Promise<ExerciseInstance>;

  start: () => void;
  correct: () => void;
  retry: () => void;
  next: () => void;
  previous: () => void;
  end: () => void;

  startTimeInterval: () => void;
  stopTimeInterval: () => void;

  setCurrentExerciseInputValue: (id: string, newValue: string) => void;
  loadNewExercise: () => void;
  initExerciseInputRef: (id: string, ref: HTMLInputElement | null) => void;
  getCurrentExercise: () => ExerciseInstance;
  getCurrentExerciseInputFromID: (id: string) => InputInstance;
  getInputCorrection: (id: string) => InputInstance["correction"];
  getIsCurrentExerciseFullyCorrect(): boolean;
  hasCurrentExerciseBeenCorrectedOnce(): boolean;
  getFullCorrection(): any;
  getFormattedTime(): string | undefined;
};

export type ExerciseStoreAttributes = {
  currentIndex: number;
  time: number;
  interval?: ReturnType<typeof setInterval>;
} & (
  | {
      atLeastOneFetched: false;
      exercises: [];
      pageState: PageState.Idle | PageState.Loading;
    }
  | {
      atLeastOneFetched: true;
      exercises: ExerciseInstance[];
      pageState: PageState.End | PageState.Loading | PageState.OnGoing;
    }
);

export type ExerciseStoreData = ExerciseStoreProps &
  ExerciseStoreActions &
  ExerciseStoreAttributes;

export const createExerciseStore = ({ resource }: ExerciseStoreProps) =>
  create<ExerciseStoreData>()((setState, getCurrentState) => ({
    async _fetchCorrection() {
      const state = getCurrentState();
      if (!state.atLeastOneFetched) throw Error();
      const exercise = state.getCurrentExercise();
      let url = `/api/r/${state.resource.id}/correct?seed=${exercise.data.seed.join(",")}`;
      const inputs = state.getCurrentExercise().inputs;
      for (const [id, input] of Object.entries(inputs)) {
        url += `&${id}=${input.value}`;
      }
      const correction: Record<string, boolean> = await fetch(url)
        .then((r) => r.json())
        .then((d) => d.correction);

      const correctionObj: Record<string, InputInstance["correction"]> = {};

      for (const [id, inp] of Object.entries(exercise.inputs)) {
        const isCorrect = correction[id];
        correctionObj[id] = {
          correct: isCorrect,
          corrected: true,
          correctOnFirstTry: inp.correction.corrected
            ? inp.correction.correctOnFirstTry
            : isCorrect,
          tries: 1 + (inp.correction.corrected ? inp.correction.tries : 0),
        };
      }
      return correctionObj;
    },
    async _fetchNewExercise() {
      return await fetch(`/api/r/${getCurrentState().resource.id}/generate`)
        .then((r) => r.json())
        .then((data) => ({
          data,
          inputs: {},
          state: ExerciseState.OnGoing,
        }));
    },
    atLeastOneFetched: false,
    async correct() {
      setState((state) => {
        if (!state.atLeastOneFetched) throw Error();
        const newExercises = [...state.exercises];
        newExercises[state.currentIndex!].state = ExerciseState.Correcting;
        return { exercises: newExercises };
      });
      const state = getCurrentState();
      const correction = await state._fetchCorrection();

      setState((state) => {
        if (!state.atLeastOneFetched) throw Error();
        const newExercises = [...state.exercises];
        const newInputs = Object.entries(
          newExercises[state.currentIndex!].inputs,
        ).reduce((prev, [id, input]) => {
          return {
            ...prev,
            [id]: {
              ...input,
              correction: correction[id],
            },
          };
        }, {});

        newExercises[state.currentIndex!] = {
          ...newExercises[state.currentIndex!],
          inputs: newInputs,
          state: ExerciseState.Corrected,
        };

        return { exercises: newExercises };
      });
    },
    currentIndex: 0,
    end() {
      getCurrentState().stopTimeInterval();
      setState({ pageState: PageState.End });
    },
    exercises: [],
    getCurrentExercise() {
      const state = getCurrentState();
      return state.exercises[state.currentIndex];
    },
    getCurrentExerciseInputFromID(id) {
      return getCurrentState().getCurrentExercise().inputs[id];
    },
    getFormattedTime() {
      const { time, interval } = getCurrentState();
      if (!interval) return;
      const s = String(time % 60).padStart(2, "0");
      const m = String(Math.floor(time / 60)).padStart(2, "0");
      return `${m}:${s}`;
    },
    getFullCorrection() {
      const { exercises } = getCurrentState();
      for (const exercise of exercises) {
        for (const [_, input] of Object.entries(exercise.inputs)) {
          input.correction;
        }
      }
      return {};
    },
    getInputCorrection(id) {
      return getCurrentState().getCurrentExerciseInputFromID(id)?.correction;
    },
    getIsCurrentExerciseFullyCorrect() {
      const ex = getCurrentState().getCurrentExercise();
      if (!ex) return false;
      for (const inp of Object.values(ex.inputs)) {
        if (inp.correction.corrected && !inp.correction.correct) return false;
      }
      return true;
    },
    hasCurrentExerciseBeenCorrectedOnce() {
      const ex = getCurrentState().getCurrentExercise();
      for (const inp of Object.values(ex.inputs)) {
        if (inp.correction.corrected) return true;
      }
      return false;
    },
    initExerciseInputRef(id, ref) {
      if (getCurrentState().getCurrentExerciseInputFromID(id)) return;
      setState((state) => {
        if (!state.atLeastOneFetched) throw Error();
        const exercises = [...state.exercises];
        exercises[state.currentIndex!].inputs = {
          ...exercises[state.currentIndex!].inputs,
          [id]: {
            correction: {
              corrected: false,
            },
            ref,
            value: "",
          },
        };
        return { exercises };
      });
    },
    async loadNewExercise() {
      const state = getCurrentState();
      if (!state.atLeastOneFetched) throw Error();

      setState({ pageState: PageState.Loading });

      const ex = await getCurrentState()._fetchNewExercise();

      setState((state) => {
        if (!state.atLeastOneFetched) throw Error();
        const newExercises = [...state.exercises, ex];
        return { exercises: newExercises, pageState: PageState.OnGoing };
      });

      state.next();
    },
    next() {
      return setState({ currentIndex: getCurrentState().currentIndex + 1 });
    },
    pageState: PageState.Idle,
    previous() {
      return setState({ currentIndex: getCurrentState().currentIndex - 1 });
    },
    resource,
    retry() {
      return setState((state) => {
        if (!state.atLeastOneFetched) throw Error();
        const exercises = [...state.exercises];
        exercises[state.currentIndex!].state = ExerciseState.OnGoing;
        return { exercises };
      });
    },
    setCurrentExerciseInputValue(id, newValue) {
      setState((state) => {
        const newExercises = [...state.exercises];
        newExercises[state.currentIndex].inputs[id].value = newValue;
        return { exercises: newExercises };
      });
    },
    async start() {
      const state = getCurrentState();
      setState({ pageState: PageState.Loading });
      const ex = await state._fetchNewExercise();
      state.startTimeInterval();
      return setState({
        atLeastOneFetched: true,
        exercises: [ex],
        pageState: PageState.OnGoing,
      });
    },
    startTimeInterval() {
      const interval = setInterval(() => {
        setState({ time: getCurrentState().time + 1 });
      }, 1000);
      setState({ interval });
    },
    stopTimeInterval() {
      clearInterval(getCurrentState().interval);
    },
    time: 0,
  }));

export type ExerciseStore = ReturnType<typeof createExerciseStore>;
export const ExerciseContext = createContext<ExerciseStore | null>(null);
