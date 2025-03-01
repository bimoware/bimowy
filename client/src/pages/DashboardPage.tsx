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
  // Define a set of rotation classes you want to choose from
  const rotationClasses = [
    "hover:rotate-1",
    "hover:-rotate-1",
    "hover:rotate-2",
    "hover:-rotate-2",
    "hover:rotate-3",
    "hover:-rotate-3",
  ];

  // Use useMemo so the random class is set once per component instance
  const randomRotationClass = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * rotationClasses.length);
    return rotationClasses[randomIndex];
  }, []);

  return (
    <div className={`w-70 bg-indigo-700/20 p-4 rounded-xl
      flex flex-col
      transition cursor-pointer
      hover:ring
      hover:scale-105 ${randomRotationClass}
      hover:shadow-2xl shadow-black
      inset-shadow-xs inset-shadow-white/5`}>
      <h4 className="self-center">{title}</h4>
      <span>{content}</span>
    </div>
  );
}
