interface DailyStat {
  date: string;
  yield: string;
  fees: string;
  backing_supply: string;
  rebasing_supply: string;
  non_rebasing_supply: string;
  apy: string;
  raw_apy: string;
  apy_boost: string;
  rebase_events: {
    amount: string;
    fee: string;
    tx_hash: string;
    block_number: number;
    block_time: string;
  }[];
}

export default DailyStat;
