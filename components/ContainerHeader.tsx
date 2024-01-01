import { ReactNodeLike } from "prop-types";
import React from "react";

export const ContainerHeader = ({ children }: { children: ReactNodeLike }) => {
  return (
    <div className="font-bold text-origin-white text-2xl px-4 md:px-8 py-3 md:py-6">
      {children}
    </div>
  );
};
