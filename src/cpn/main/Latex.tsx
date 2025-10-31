import { MathJax, MathJaxContext } from "better-react-mathjax";
import type { ReactNode } from "react";

export function LatexText({ children }: { children: ReactNode }) {
  return <MathJax>{children}</MathJax>;
}

export function LatexProvider({ children }: { children: ReactNode }) {
  return <MathJaxContext>{children}</MathJaxContext>;
}
