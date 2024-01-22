import { DailyStat, Link } from "../../types";
import { DailyYield } from "../../queries/fetchDailyYields";

interface YieldOnDayProps {
  navLinks: Link[];
  dailyStat: DailyStat;
  strategiesLatest: DailyYield[];
  strategyHistory: Record<string, DailyYield[]>;
}

export default YieldOnDayProps;
