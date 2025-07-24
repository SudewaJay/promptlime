import React from "react";
import clsx from "clsx";
import type { ElementType, ComponentPropsWithoutRef } from "react";

type HoverBorderGradientProps<C extends ElementType> = {
  as?: C;
  containerClassName?: string;
  className?: string;
} & ComponentPropsWithoutRef<C>;

export function HoverBorderGradient<C extends ElementType = "div">({
  as,
  containerClassName,
  className,
  ...rest
}: HoverBorderGradientProps<C>) {
  const Component = as || "div";

  return (
    <div className={clsx("relative group", containerClassName)}>
      <Component
        {...rest}
        className={clsx(
          "relative z-10 rounded-full transition-all",
          className
        )}
      />
    </div>
  );
}