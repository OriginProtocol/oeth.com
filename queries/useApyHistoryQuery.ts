import { useQuery } from "react-query";

import { QUERY_KEYS, apyDayOptions } from "../constants";
import moment from "moment";

async function fetchApyHistory() {
  const apyHistory = await Promise.all(
    apyDayOptions.map(async (days) => {
      const endpoint = `${process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT}/api/v2/oeth/apr/trailing_history/${days}`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${days}-day trailing APY history`);
      }
      const json = await response.json();
      return json.trailing_history;
    })
  ).catch(function (err) {
    console.log(err.message);
  });
  const data = {};
  apyDayOptions.map((days, i) => {
    data[`apy${days}`] = apyHistory ? apyHistory[i] : [];
  });

  Object.keys(data).map((key) => {
    data[key] = data[key].filter((item) =>
      moment(item.day).isAfter("2023-05-06")
    );
  });

  return data;
}

const useApyHistoryQuery = (apyHistory, options = {}) => {
  return useQuery(QUERY_KEYS.ApyHistory(365), fetchApyHistory, {
    initialData: apyHistory,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    ...options,
  });
};

export default useApyHistoryQuery;
