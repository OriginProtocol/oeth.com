import { ReactNodeLike } from "prop-types";
import React from "react";
import { twMerge } from "tailwind-merge";

export const ContainerHeader = ({
  children,
  small,
}: {
  children: ReactNodeLike;
  small?: boolean;
}) => {
  return (
    <div
      className={twMerge(
        "px-4 md:px-6 py-3 md:py-6",
        small
          ? "text-origin-white/60 text-base"
          : "font-bold text-origin-white text-2xl",
      )}
    >
      {children}
    </div>
  );
};
