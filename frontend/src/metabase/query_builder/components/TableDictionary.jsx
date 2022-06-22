/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React from "react";
import "./QueryPreview.css";
import Icon from "metabase/components/Icon";
import Link from "metabase/components/Link";
import Tooltip from "metabase/components/Tooltip";
import { isNumber } from "underscore";

const TableDictionary = ({ tableName, tableId }) => {
  const isUdTable = !!tableName?.toLowerCase()?.startsWith("ud");
  const isTable = isNumber(tableId);
  return (
    <div className="flex align-center">
      {!isUdTable && isTable && (
        <Tooltip
          tooltip={"Data Dictionary"}
          verticalAttachments={["top", "bottom"]}
        >
          <Link
            className="flex align-center px1 ml1"
            to={`https://www.footprint.network/@Footprint/Table-Info-Dashboard?table_name=${tableName}`}
            target={"_blank"}
          >
            <Icon name="data_dictionary" size={20} />
          </Link>
        </Tooltip>
      )}
    </div>
  );
};

export default TableDictionary;
