// src/components/ui/typography.tsx
import { cn } from "../../lib/utils";

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  level?: 1 | 2 | 3 | 4;
};

export function Heading({ level = 1, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as unknown as "h1" | "h2" | "h3" | "h4";

  const base = "scroll-m-20 tracking-tight text-slate-800";
  const variants = {
    1: "text-4xl font-extrabold lg:text-5xl",
    2: "text-2xl font-bold lg:text-3xl",
    3: "text-xl font-semibold lg:text-2xl",
    4: "text-lg font-medium lg:text-xl",
  } as const;

  return <Tag className={cn(base, variants[level], className)} {...props} />;
}
