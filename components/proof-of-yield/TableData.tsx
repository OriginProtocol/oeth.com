import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface TableDataProps {
  align?: "left" | "right" | "center";
  className?: string;
  width?: string;
}

const text = {
  right: "text-right",
  left: "text-left",
  center: "text-center",
};

const component = {
  right: "float-right",
  left: "float-left",
  center: "flex justify-center",
};

const TableData = ({
  align,
  className,
  width,
  children,
}: PropsWithChildren<TableDataProps>) => {
  return (
    <td
      className={twMerge(
        `text-xs md:text-xl text-table-data py-6 w-[1%] whitespace-nowrap ${
          align ? text[align] : "text-right"
        }`,
        className,
      )}
      width={width || "auto"}
    >
      <div className={`${align ? component[align] : "float-right"}`}>
        {children}
      </div>
    </td>
  );
};

export default TableData;
