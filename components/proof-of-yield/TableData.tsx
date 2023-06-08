import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface TableDataProps {
  align?: "left" | "right" | "center";
  className?: string;
  width?: string;
}

const TableData = ({
  align,
  className,
  width,
  children,
}: PropsWithChildren<TableDataProps>) => {
  return (
    <td
      className={twMerge(
        `text-xs md:text-xl text-table-data py-6 lg:py-9 w-[1%] whitespace-nowrap ${
          align ? align : "text-right"
        }`,
        className
      )}
      width={width || "auto"}
    >
      {children}
    </td>
  );
};

export default TableData;
