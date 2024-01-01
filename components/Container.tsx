import { ReactNodeLike } from "prop-types";
import React from "react";
import { twMerge } from "tailwind-merge";

export const Container = ({
  children,
  className,
}: {
  children: ReactNodeLike;
  className?: string | undefined;
}) => (
  <div
    className={twMerge(
      "w-full bg-origin-bg-grey rounded md:rounded-lg border-spacing-0",
      className,
    )}
  >
    {children}
  </div>
);
