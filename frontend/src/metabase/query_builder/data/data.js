const dateFieldMapping = {
  mapping: [
    //nft_transactions
    //{chain}_transactions
    //{chain}_token_transfers
    //{chain}_logs
    {
      tableName: "nft_transactions",
      dateField: "block_timestamp",
    },
  ],
  dateFieldSuffix: [
    //nft_transactions
    //{chain}_transactions
    //{chain}_token_transfers
    //{chain}_logs
    {
      tableName: "_transactions",
      dateField: "block_timestamp",
    },
    {
      tableName: "_token_transfers",
      dateField: "block_timestamp",
    },
    {
      tableName: "_logs",
      dateField: "block_timestamp",
    },
  ],
}

export default dateFieldMapping;
