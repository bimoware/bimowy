const randomClassNames = [
  ["hover:scale-105", "hover:scale-110"],
  [
    "hover:translate-y-1",
    "hover:translate-y-0.5",
    "hover:-translate-y-0.5",
    "hover:-translate-y-1",
    "hover:-translate-y-1.5",
  ],
  [
    "hover:translate-x-0.5",
    "hover:translate-x-1",
    "hover:-translate-x-0.5",
    "hover:-translate-x-1",
  ],
  [
    "hover:-rotate-0.5",
    "hover:-rotate-1",
    "hover:-rotate-2",
    "hover:rotate-0.5",
    "hover:rotate-1",
    "hover:rotate-2",
  ],
];

export function getPseudoRandomClassName(id: string) {
  const uniqueId = id
    .split("")
    .reduce((prev, curr) => prev + curr.charCodeAt(0), 0);
  return randomClassNames.map((grp) => grp[uniqueId % grp.length]).join(" ");
}
