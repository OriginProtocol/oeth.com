import { ReactNodeLike } from "prop-types";
import React from "react";
import { twMerge } from "tailwind-merge";

export const ContainerBody = ({
  children,
  className,
  padding = true,
}: {
  children: ReactNodeLike;
  className?: string | undefined;
  padding?: boolean;
}) => {
  return (
    <div
      className={twMerge(
        "text-origin-white",
        padding ? "px-4 md:px-8 pb-3 md:pb-6" : "",
        className,
      )}
    >
      {children}
    </div>
  );
};
