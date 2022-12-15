/* eslint-disable curly */
import { Parser } from "acorn";

const func_mapping = {
  diff: {
    name: "calc_diff",
    args_prefix: ["", "", "index", "sort", "ascending"],
  },
};

function formula_to_js(formula) {
  return formula.replaceAll("=", "");
}

function compile(formula) {
  // console.log("formula:", formula);
  const code = formula_to_js(formula);
  // console.log("formula to js code:", code);
  return Parser.parse(code, { ecmaVersion: "2019" });
}

function output_pandas_head({ sql, token }) {
  if (!sql || !token) return "";
  return `
import pandas as pd
import gaia_utils as gu

gu.set_token("${token}")

sql = """
${sql
  .replace("FROM `", "FROM `gaia-data.gaia.")
  .replace(/^SELECT.*?FROM/, "SELECT * FROM")}
"""
table_data = gu.load_dataframe(gu.LoadDataframeType.SQL, sql)

def calc_diff(df, base_column, periods, sort_column):
    df.set_index(sort_column)
    res = base_column.diff(periods=periods)
    return res

def pct_change(df, base_column, date_column, periods=1, freq=None):
    date_column = pd.to_datetime(date_column)
    base_column.index = date_column
    res = base_column.pct_change(periods=periods, freq=freq)
    res.index = df.index
    return res
  `;
}

function output_pandas_bottom() {
  return `
df.to_json(orient="split", date_format="iso", date_unit="s", double_precision=4)
  `.trimStart();
}

function output_pandas_submit({ project_id, dataset_id, table_name }) {
  return `
gu.submit(
    project_id="${project_id}",
    dataset_id="${dataset_id}",
    table_name="${table_name}",
    pd_data=df,
    reset_force=True
)
`.trimStart();
}

function convert_item(item) {
  // console.log(item.type);
  if (item.type === "BinaryExpression")
    return `${convert_item(item.left)} ${item.operator} ${convert_item(
      item.right,
    )}`;
  if (item.type === "Literal") return item.raw;
  if (item.type === "Identifier") {
    if (["True", "False"].includes(item.name)) return item.name;
    if (item.name.match(/^\$/)) {
      return 'df["' + item.name.replaceAll("$", "") + '"]';
    }
    throw new Error("Unable to identify the identifier");
  }
  if (item.type === "CallExpression") {
    let args = item.arguments.map(it => convert_item(it));
    args = ["df", ...args];

    let func_name = item.callee.name;
    if (func_mapping[func_name]) {
      const mapping = func_mapping[item.callee.name];
      func_name = mapping.name;
      args = args.map((e, i) => {
        if (mapping.args_prefix[i]) return `${mapping.args_prefix[i]}=${e}`;
        else return e;
      });
    }
    return `${func_name}(${args.join(", ")})`;
  }
  // throw new Error("Unable to identify the formula");
}

function convert_formula(ast) {
  const exStatement = ast.body[0];
  const output = convert_item(exStatement.expression);
  return output;
}

function transform(field, formula) {
  const ast = compile(formula);
  const cal = convert_formula(ast);
  const output = `df['${field}'] = ${cal}`;
  // console.log("output:", output);
  return output;
}

export function code_generate({
  formulas = [],
  sql,
  token,
  submitParams = null,
}) {
  const head = output_pandas_head({ sql, token });
  const bodys = ["df = table_data.copy(deep=True)"];
  formulas.forEach(item => bodys.push(transform(item.name, item.formula)));
  const bottom = output_pandas_bottom();
  const all = [head, ...bodys, bottom];
  submitParams && all.push(output_pandas_submit(submitParams));
  return all.join("\n");
}
