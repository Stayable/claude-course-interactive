import type { MDXComponents } from "mdx/types";
import { Diagram } from "@/components/Diagram";
import { Quiz } from "@/components/Quiz";
import { Playground } from "@/components/Playground";
import { Callout } from "@/components/Callout";
import { Reveal } from "@/components/Reveal";
import { SurfaceMap } from "@/components/SurfaceMap";
import { Compare } from "@/components/Compare";
import { TypingDemo } from "@/components/TypingDemo";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { Attribution } from "@/components/Attribution";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Diagram,
    Quiz,
    Playground,
    Callout,
    Reveal,
    SurfaceMap,
    Compare,
    TypingDemo,
    RoleSwitcher,
    Attribution,
    ...components,
  };
}
