"use client";
import { useContext, useRef } from "react";
import {
  type ExerciseResourceBuilder,
  resourceTypeData,
} from "@/lib/resources";
import { BottomBar } from "./BottomBar";
import { EndPage } from "./EndPage";
import { createExerciseStore, ExerciseContext, PageState } from "./store";
import { UIElements } from "./UIElement";

export default function ExerciseResourcePage({
  resource,
}: {
  resource: ReturnType<ExerciseResourceBuilder["build"]>;
}) {
  const store = useRef(createExerciseStore({ resource })).current;
  const resourceType = resourceTypeData["exercise"];

  return (
    <ExerciseContext.Provider value={store}>
      <div className="flex flex-col h-full gap-2">
        <span className="text-3xl font-bold text-center w-full">
          {resourceType.emoji} {resource.name}
        </span>
        <div className="w-full h-full p-1 flex flex-col">
          <div
            className="h-full w-full
          "
          >
            <MainLayout />
          </div>
          <BottomBar />
        </div>
      </div>
    </ExerciseContext.Provider>
  );
}

function MainLayout() {
  const store = useContext(ExerciseContext)!;
  const [pageState, atLeastOneFetched] = [
    store((state) => state.pageState),
    store((state) => state.atLeastOneFetched)
  ]

  if (!atLeastOneFetched) {
    return (
      <div className="w-full h-full flex items-center justify-center"></div>
    );
  }

  if (pageState === PageState.End) return <EndPage />;
  return <UIElements />;
}
