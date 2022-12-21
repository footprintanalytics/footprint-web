/* eslint-disable react/prop-types */
import React from "react";
import { get } from "lodash";
import { Parser } from "node-sql-parser";
import Link from "metabase/core/components/Link";
import "./SqlOptimizeContent.css";

const SqlOptimizeContent = ({
  sql
}) => {
  console.log("sql", sql)
  const isWhereValueOrColumn = (where, value) => {

    let result = false;
    if (where?.left?.left) {
      result = result || isWhereValueOrColumn(where?.left, value);
    }
    if (where?.left?.right) {
      result = result || isWhereValueOrColumn(where?.left, value);
    }
    if (where?.right?.left) {
      result = result || isWhereValueOrColumn(where?.right, value);
    }
    if (where?.right?.right) {
      result = result || isWhereValueOrColumn(where?.right, value);
    }
    return result || (where?.left?.column === value || where?.left?.value === value ||
      where?.right?.column === value || where?.right?.value === value);
  }

  const handleSqlObject = (object, roleArray) => {
    const tableName = get(object.from, 0)?.table;
    if (object.columns === "*") {
      roleArray?.push({ type: "query_all_column", tableName, result: `Table ${tableName} query with "*", you can specify some columns. \ne.g. select chain from table` });
    }
    const isUdTable = !!tableName?.toLowerCase()?.startsWith("ud");
    const isBronzeTable = !isUdTable
      &&
      (tableName?.endsWith("_transactions")
        || tableName?.endsWith("_token_transfers")
        || tableName?.endsWith("_logs")
        || tableName?.endsWith("_traces"))
    ;
    if (isBronzeTable && !isWhereValueOrColumn(object.where, "block_timestamp")) {
      roleArray?.push({ type: "bronze_no_block_timestamp", tableName, result: `Table ${tableName} query the full data, you can specify the query time. \ne.g. select * from ${tableName} where block_timestamp > date_add('day',-7,current_date)`});
    }

    if (object?.with) {
      object?.with?.map(item => {
        handleSqlObject(item?.stmt?.ast, roleArray);
      })
    }
  }

  const getSqlOptimize = sql => {
    const roleArray = [];
    let optimize = null;
    try {
      const parser = new Parser();
      //"xx"."yy" in node-sql-parser run error. so this way.
      const fixSql = sql.replace(/(['|"]\w+['|"]\.)+(['|"]\w+['|"])/g, "$2");
      const result = parser.astify(fixSql);
      handleSqlObject(result, roleArray);

      optimize = roleArray;
    } catch (e) {
    }
    return optimize;
  }

  const tips = getSqlOptimize(sql);
  const hasTips = tips && tips?.length > 0;

  return (
    <div className="sql-tip__inner">
      <div className="sql-tip__inner-top">
        You can find more SQL Best Practices in this <Link className="underline text-underline text-underline-hover" to="https://docs.footprint.network/docs/sql">docs</Link>.

        <div className="sql-tip__inner-total">
          {hasTips ? `Total ${tips?.length || 0} tips.` : "No tips."}
        </div>
      </div>
      {hasTips && (
        <>
          <div className="sql-tip__division"/>
          <div className="sql-tip__content">
            <ul>
              {tips.map((item, index) => {
                return (
                  <li key={index}>
                    <h4>{`Tip ${index + 1}: `}</h4>
                    {item.result}
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};


export default React.memo(SqlOptimizeContent);
