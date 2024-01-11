import { ReactNodeLike } from "prop-types";
import React from "react";
import { twMerge } from "tailwind-merge";

export const ContainerHeader = ({
  children,
  className,
  small,
}: {
  children: ReactNodeLike;
  className?: string;
  small?: boolean;
}) => {
  return (
    <div
      className={twMerge(
        "px-4 md:px-6 py-3 md:py-6",
        small
          ? "text-origin-white/60 text-base"
          : "font-bold text-origin-white text-2xl",
        className,
      )}
    >
      {children}
    </div>
  );
};
