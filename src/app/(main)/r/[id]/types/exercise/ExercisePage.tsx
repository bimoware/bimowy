"use client";
import { type ReactNode, useEffect, useRef } from "react";
import type { ExerciseResourceBuilder } from "@/lib/resources";
import { EndPage } from "./EndPage";
import { MetaBar } from "./MetaBar";
import { OptionsPage } from "./OptionsPage";
import {
  createExerciseStore,
  ExerciseContext,
  PageState,
  useExerciseStore,
} from "./store";
import { UIElements } from "./UIElement";

export default function ExerciseResourcePage({
  resource,
}: {
  resource: ReturnType<ExerciseResourceBuilder["build"]>;
}) {
  return (
    <StoreProvider {...{ resource }}>
      <div className="flex flex-col h-full gap-2">
        <div className="w-full h-full p-1 flex flex-col">
          <MetaBar />
          <div className="h-full w-full">
            <MainLayout />
          </div>
        </div>
      </div>
    </StoreProvider>
  );
}

function StoreProvider({
  children,
  resource,
}: {
  children: ReactNode;
  resource: ReturnType<ExerciseResourceBuilder["build"]>;
}) {
  const store = useRef(createExerciseStore({ resource })).current;

  useEffect(() => {
    (window as any).store = store;
  }, []);

  return (
    <ExerciseContext.Provider value={store}>
      {children}
    </ExerciseContext.Provider>
  );
}

function MainLayout() {
  const [pageState, atLeastOneFetched] = [
    useExerciseStore((state) => state.pageState),
    useExerciseStore((state) => state.atLeastOneFetched),
  ];

  if (!atLeastOneFetched) return <OptionsPage />;

  if (pageState === PageState.End) return <EndPage />;

  return <UIElements />;
}
