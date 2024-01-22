import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { ReactNodeLike } from "prop-types";

interface GradientButtonProps {
  onClick?: () => void;
  href?: string;
  className?: string;
  elementId?: string;
  outerDivClassName?: string;
  small?: boolean;
}

const GradientButton = ({
  onClick,
  href,
  className,
  elementId,
  outerDivClassName,
  children,
  small,
}: PropsWithChildren<GradientButtonProps>) => {
  const wrapClassName = twMerge(
    "relative bg-gradient2 rounded-[100px] p-[1px] w-fit h-fit hover:opacity-90",
    outerDivClassName,
  );
  const wrap = (children: ReactNodeLike) =>
    href ? (
      <a href={href} className={wrapClassName}>
        {children}
      </a>
    ) : (
      <div className={wrapClassName}>{children}</div>
    );
  return wrap(
    <button
      onClick={onClick}
      className={twMerge(
        `relative hover:bg-[#1b1a1abb] bg-origin-bg-black rounded-[100px] text-origin-white`,
        small ? "px-3 lg:px-4 py-1" : "px-4 lg:px-6 py-2",
        className,
      )}
      id={elementId}
    >
      {children}
    </button>,
  );
};

export default GradientButton;
