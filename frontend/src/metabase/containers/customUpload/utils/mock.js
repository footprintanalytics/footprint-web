import dayjs from "dayjs";

export const mockTableSchema = [
  { name: "date" },
  { name: "chain" },
  { name: "volume" },
];

const date = dayjs().format("YYYY-MM-DD");
export const mockTablePartData = [
  mockTableSchema.map(item => item.name),
  [date, "Ethereum", "29,506,112"],
  [date, "Polygon", "43,154,890"],
  [date, "Ethereum", "59,105,232"],
  [date, "Polygon", "23,231"],
  [date, "Ethereum", "16"],
];

export const mockPrepareData = {
  tableName: "fortube_whale_cohort",
  tableSchema: [
    { name: "first_deposit_quarter", type: "TEXT", mode: "NULLABLE" },
    { name: "deposit_amount", type: "NUMBER", mode: "NULLABLE" },
    { name: "quanter1", type: "NUMBER", mode: "NULLABLE" },
    { name: "quanter2", type: "NUMBER", mode: "NULLABLE" },
    { name: "quanter3", type: "NUMBER", mode: "NULLABLE" },
    { name: "quanter4", type: "NUMBER", mode: "NULLABLE" },
    { name: "quanter5", type: "NUMBER", mode: "NULLABLE" },
    { name: "quanter6", type: "NUMBER", mode: "NULLABLE" },
    { name: "aaa", type: "NUMBER", mode: "NULLABLE" },
    { name: "ccc", type: "TEXT", mode: "NULLABLE" },
  ],
  tablePartData: [
    [
      "first_deposit_quarter",
      "deposit_amount",
      "quanter1",
      "quanter2",
      "quanter3",
      "quanter4",
      "quanter5",
      "quanter6",
      "aaa",
      "ccc",
    ],
    [
      "20-Sep",
      "5897097.324",
      "0.01416",
      "0.00081",
      "0.00135",
      "0.00141",
      "0.00317",
      "0.00144",
      "1",
      "aa",
    ],
    [
      "20-Dec",
      "2219237.26",
      "0.70097",
      "0.70097",
      "0.70097",
      "0.70097",
      "0.70097",
      "0.70097",
      "2",
      "v",
    ],
    ["21-Mar", "275066.4182", "0", "0", "0", "0", "0", "0", "3", "a"],
    [
      "21-Jun",
      "9883565.359",
      "0.864",
      "0.76821",
      "1.17389",
      "0.864",
      "0",
      "0",
      "4",
      "a",
    ],
    ["21-Sep", "12076395.59", "0.00466", "0.002", "0", "0", "0", "0", "5", "d"],
  ],
  bigquerySchemaType: {
    NUMBER: "NUMBER",
    TEXT: "TEXT",
    DATE: "DATE",
  },
  storageName:
    "prepare__fp_csv_custom_file_upload_dev/fortube_whale_cohort_1.csv",
};
