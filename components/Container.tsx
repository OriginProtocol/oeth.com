import { ReactNodeLike } from "prop-types";
import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const Container = forwardRef<
  HTMLDivElement,
  {
    children: ReactNodeLike;
    className?: string | undefined;
  }
>(({ children, className }, ref) => (
  <div
    ref={ref}
    className={twMerge(
      "w-full bg-origin-bg-grey rounded md:rounded-lg border-spacing-0",
      className,
    )}
  >
    {children}
  </div>
));
