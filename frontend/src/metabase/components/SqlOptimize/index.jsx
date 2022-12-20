/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { connect } from "react-redux";
import { Parser } from "node-sql-parser";
import { get } from "lodash";
import { getUser } from "metabase/selectors/user";
import SqlTipModal from "metabase/components/SqlOptimize/SqlTipModal";
import { t } from "ttag";
import Tooltip from "metabase/components/Tooltip";
import Button from "metabase/core/components/Button";
const Index = ({
  user,
  sql,
}) => {

  const [showSqlTipModal, setShowSqlTipModal] = useState(false);

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
      roleArray?.push({ type: "query_all_column", tableName, result: `${tableName} query with "*", we can specify some columns.` });
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
      roleArray?.push({ type: "bronze_no_block_timestamp", tableName, result: `${tableName} query the full data, we can specify the query time. \neg. where block_timestamp > date_add('day',-1,current_date)`});
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
      console.error(e)
    }
    return optimize;
  }

  if (!sql) {
    return null;
  }

  return (
    <>
      <Tooltip tooltip={t`Sql optimize`}>
        <Button
          onlyIcon
          className="Question-header-btn-new"
          iconColor="#7A819B"
          iconSize={16}
          onClick={() => {
            setShowSqlTipModal(true)
          }}
        >
          Sql optimize
        </Button>
      </Tooltip>
      {showSqlTipModal && (
        <SqlTipModal tips={getSqlOptimize(sql)} title="Sql Optimize" onClose={() => setShowSqlTipModal(false)}/>
      )}
    </>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state, props),
  };
};

export default connect(mapStateToProps, null)(Index);
