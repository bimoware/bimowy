import { useMemo } from 'react';

export default function DashboardPage() {
  const subjects = [
    { title: "Basic Algebra", content: "Operations, PEMDAS, Equations..." },
    { title: "Geometry", content: "Points, Lines, Angles, Triangles, Circles, Pythagoras Theorem" },
    { title: "Trigonometry", content: "Sine, Cosine, Tangent, Unit Circle, Law of Sines and Cosines" },
    { title: "Calculus", content: "Limits, Derivatives, Integrals, Chain Rule, Product Rule" },
    { title: "Linear Algebra", content: "Matrices, Determinants, Vectors, Eigenvalues, Eigenvectors" },
    { title: "Statistics", content: "Mean, Median, Mode, Standard Deviation, Probability" },
    { title: "Set Theory", content: "Union, Intersection, Subsets, Venn Diagrams" },
    { title: "Number Theory", content: "Prime Numbers, Divisibility, Greatest Common Divisor, Least Common Multiple" },
    { title: "Combinatorics", content: "Permutations, Combinations, Binomial Theorem" }
  ];

  return (
    <>
      <h1>Dashboard</h1>
      <div className="flex gap-6 flex-wrap justify-center">
        {subjects.map(({ title, content }, i) => (
          <SubjectBloc key={i} title={title} content={content} />
        ))}
      </div>
    </>
  );
}

interface SubjectBlocProps {
  title: string,
  content: string
}

export function SubjectBloc({ title, content }: SubjectBlocProps) {
  const rotationClasses = [
    "hover:rotate-1",
    "hover:-rotate-1",
    "hover:rotate-2",
    "hover:-rotate-2",
    "hover:rotate-3",
    "hover:-rotate-3",
  ];

  const translationXClasses = [
    "hover:translate-x-0",
    "hover:translate-x-1",
    "hover:-translate-x-1",
    "hover:translate-x-2",
    "hover:-translate-x-2"
  ];
  const translationYClasses = [
    "hover:translate-y-0",
    "hover:translate-y-1",
    "hover:-translate-y-1",
    "hover:translate-y-2",
    "hover:-translate-y-2"
  ];

  const randomFrom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
  const randomRotationClass = useMemo(() => {
    return [rotationClasses, translationXClasses, translationYClasses]
      .map(randomFrom)
  }, []);

  return (
    <div className={`w-70 bg-neutral-700/20 p-4 rounded-xl
      flex flex-col
      transition cursor-pointer
      hover:ring-2 hover:scale-105
      ${randomRotationClass.join(' ')}
      hover:shadow-2xl shadow-black
      inset-shadow-xs inset-shadow-white/5
      select-none`}>
      <h4 className="self-center">{title}</h4>
      <span>{content}</span>
    </div>
  );
}
