import { Typography } from "@originprotocol/origin-storybook";
import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import TitleWithInfo from "./TitleWithInfo";

interface TableHeadProps {
  info?: string;
  align?: "left" | "right" | "center";
  className?: string;
}

const text = {
  right: "text-right",
  left: "text-left",
  center: "text-center",
};

const component = {
  right: "float-right",
  left: "float-left",
};

const TableHead = ({
  info,
  align,
  className,
  children,
}: PropsWithChildren<TableHeadProps>) => {
  return (
    <th
      className={twMerge(
        `py-6 w-[1%] whitespace-nowrap ${align ? text[align] : "text-right"}`,
        className
      )}
    >
      <div className={`${align ? component[align] : "float-right"}`}>
        {info ? (
          <TitleWithInfo info={info}>{children}</TitleWithInfo>
        ) : (
          <Typography.Body2 className="text-xs md:text-base text-table-title">
            {children}
          </Typography.Body2>
        )}
      </div>
    </th>
  );
};

export default TableHead;
