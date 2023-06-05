import { Typography } from "@originprotocol/origin-storybook";

const DefaultChartHeader = ({ title, display, date }) => {
  return (
    <div className="flex flex-col w-full h-full">
      <Typography.Caption className="text-subheading text-base">
        {title}
      </Typography.Caption>
      <Typography.H4 className="text-4xl font-medium">{display}</Typography.H4>
      <Typography.Caption className="text-subheading">
        {date}
      </Typography.Caption>
    </div>
  );
};

export default DefaultChartHeader;
