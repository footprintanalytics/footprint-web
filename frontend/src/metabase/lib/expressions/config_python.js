export const helperTextStrings = [
  {
    name: "calc_diff",
    structure: `calc_diff(base_column, periods, sort_column)`,
    description: `Sort [base_column] in descending order of [sort_column], and return the difference between the current day and the [periods] day.`,
    example: `calc_diff([tvl], 7, [day])`,
    args: [
      {
        name: `base_column`,
        description: `Base column.`,
      },
      {
        name: `periods`,
        description: `Periods to shift for calculating difference.`,
      },
      {
        name: `sort_column`,
        description: `Used to sort the base column.`,
      },
    ],
  },
  {
    name: `pct_change`,
    structure: `pct_change(base_column, date_column, periods, freq)`,
    description: `Percentage change between the current and a prior element.`,
    example: `pct_change([tvl], [day], 1, "D")`,
    args: [
      {
        name: `base_column`,
        description: `Base column.`,
      },
      {
        name: `date_column`,
        description: `Index column.`,
      },
      {
        name: `periods`,
        description: `Periods to shift for forming percent change.`,
      },
      {
        name: `freq`,
        description: `Increment to use from time series API.`,
      },
    ],
  },
];

export const MBQL_CLAUSES = {
  calc_diff: {
    mode: "python",
    displayName: "calc_diff",
    type: "number",
    args: ["expression", "number", "expression"],
  },
  pct_change: {
    mode: "python",
    displayName: "pct_change",
    type: "number",
    args: ["expression", "expression", "number", "string"],
    multiple: true,
  },
};
