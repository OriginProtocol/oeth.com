import { useQuery } from "react-query";
import { QUERY_KEYS } from "../constants";

import { fetchApyHistory } from "../utils";

const useApyHistoryQuery = (apyHistory, options = {}) => {
  return useQuery(QUERY_KEYS.ApyHistory(365), fetchApyHistory, {
    initialData: apyHistory,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    ...options,
  });
};

export default useApyHistoryQuery;
