import React from "react";
import { ReactNodeLike } from "prop-types";
import Image from "next/image";
import { assetRootPath } from "../utils";

export const ExternalLinkButton = ({
  href,
  children,
}: {
  href: string;
  children: ReactNodeLike;
}) => {
  return (
    <a
      href={href}
      className="border border-origin-blue px-4 py-1.5 rounded-full text-sm"
      target={"_blank"}
      rel="noopener noreferrer"
    >
      {children}
      <Image
        src={assetRootPath("/images/ext-link-white.svg")}
        width="14"
        height="14"
        alt="ext-link"
        className="inline ml-2 mb-0.5 w-2 h-2"
      />
    </a>
  );
};
