import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface Gradient2ButtonProps {
  onClick?: () => void;
  className?: string;
  elementId?: string;
  outerDivClassName?: string;
}

const GradientButton = ({
  onClick,
  className,
  elementId,
  outerDivClassName,
  children,
}: PropsWithChildren<Gradient2ButtonProps>) => {
  return (
    <div
      className={twMerge(
        "relative bg-gradient2 rounded-[100px] p-[1px] w-fit h-fit hover:opacity-90",
        outerDivClassName
      )}
    >
      <button
        onClick={onClick}
        className={twMerge(
          `relative hover:bg-[#1b1a1abb] bg-origin-bg-black rounded-[100px] px-4 lg:px-6 py-2 text-origin-white `,
          className
        )}
        id={elementId}
      >
        {children}
      </button>
    </div>
  );
};

export default GradientButton;
