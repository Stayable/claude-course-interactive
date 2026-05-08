import type { MDXComponents } from "mdx/types";
import { Diagram } from "@/components/Diagram";
import { Quiz } from "@/components/Quiz";
import { Playground } from "@/components/Playground";
import { Callout } from "@/components/Callout";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Diagram,
    Quiz,
    Playground,
    Callout,
    ...components,
  };
}
