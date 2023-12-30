import { ReactNodeLike } from "prop-types";
import React from "react";

export const SectionBody = ({ children }: { children: ReactNodeLike }) => {
  return (
    <div className="text-origin-white px-4 md:px-8 pb-3 md:pb-6">
      {children}
    </div>
  );
};
