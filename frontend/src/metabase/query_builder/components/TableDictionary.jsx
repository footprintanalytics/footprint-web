/* eslint-disable react/prop-types */
import React from "react";
import { isNumber } from "underscore";
import connect from "react-redux/lib/connect/connect";
import Link from "metabase/core/components/Link";
import Tooltip from "metabase/components/Tooltip";
import Button from "metabase/core/components/Button";
import { getTableConfigList } from "metabase/selectors/config";
import getBetaTable from "metabase/query_builder/components/TableBetaHelper";

const TableDictionary = ({ tableName, tableId, tableConfigList, mode }) => {
  const isUdTable = !!tableName?.toLowerCase()?.startsWith("ud");
  const isTable = isNumber(tableId);

  const betaTable = getBetaTable({ tableName, tableId, tableConfigList });

  // beta table can't be seen the dictionary entrance.
  if (betaTable) {
    return null;
  }

  const getContent = () => {
    if (mode === "text") {
      return (
        <Link
          className="flex align-center"
          to={`https://www.footprint.network/@Footprint/Table-Info-Dashboard?table_name=${tableName}`}
          target={"_blank"}
        >
          <Button className="ml1">Dictionary</Button>
        </Link>
      );
    }

    return (
      <Tooltip
        tooltip={"Data Dictionary"}
        verticalAttachments={["top", "bottom"]}
      >
        <Link
          className="flex align-center"
          to={`https://www.footprint.network/@Footprint/Table-Info-Dashboard?table_name=${tableName}`}
          target={"_blank"}
        >
          <Button
            onlyIcon
            iconColor="#ACACB2"
            icon={"data_dictionary"}
            iconSize={16}
            className="ml1 Question-header-btn"
          />
        </Link>
      </Tooltip>
    );
  };

  return (
    <div className="flex align-center">
      {!isUdTable && isTable && getContent()}
    </div>
  );
};

const mapStateToProps = state => ({
  tableConfigList: getTableConfigList(state),
});

export default connect(mapStateToProps, null)(TableDictionary);
