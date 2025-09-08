import { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/app/lib/utils";

type BoxProps<T extends ElementType> = {
  as?: T;
  className?: string;
} & ComponentPropsWithoutRef<T>;

export function Box<T extends ElementType = "div">({
  as,
  className,
  ...props
}: BoxProps<T>) {
  const Component = as || "div";
  return <Component className={cn(className)} {...props} />;
}
