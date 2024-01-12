import React from "react";
import { ReactNodeLike } from "prop-types";
import Image from "next/image";
import { assetRootPath } from "../utils";
import { twMerge } from "tailwind-merge";

export const ExternalLinkButton = ({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNodeLike;
  className?: string | undefined;
}) => {
  return (
    <a
      href={href}
      className={twMerge(
        "border border-origin-blue px-4 py-1.5 rounded-full text-sm",
        className,
      )}
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
