"use client";

import { useQueryState } from "nuqs";
import { ResourceCard } from "@/cpn/main/ResourceCard";
import SearchBar from "@/cpn/main/SearchBar";
import type { ExerciseResourceBuilder } from "@/lib/resources";

export function ResourceClientPage({
  resources,
}: {
  resources: ReturnType<ExerciseResourceBuilder["build"]>[];
}) {
  const [query, setQuery] = useQueryState("q");

  return (
    <>
      <SearchBar {...{ query, setQuery }} />
      <div className="flex gap-6 w-full flex-wrap justify-center">
        {resources
          .filter((r) =>
            query ? r.name.toLowerCase().includes(query.toLowerCase()) : true,
          )
          .map((data) => (
            <ResourceCard key={data.id} {...{ data }} />
          ))}
      </div>
    </>
  );
}
