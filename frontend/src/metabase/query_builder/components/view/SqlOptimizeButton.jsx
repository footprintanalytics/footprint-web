/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from "react";
import { t } from "ttag";
import cx from "classnames";
import Tooltip from "metabase/components/Tooltip";
import Button from "metabase/core/components/Button";
import { trackStructEvent } from "metabase/lib/analytics";
import { useDebouncedValue } from "metabase/hooks/use-debounced-value";
import getSqlOptimize from "metabase/query_builder/components/view/sidebars/SqlOptimizeSidebar/helper";

const SqlOptimizeButton = ({ question, isShowingSqlOptimizeSidebar, showSqlOptimize, toggleSqlOptimize, size = 16 }) => {
  const [isShow, setIsShow] = useState(false);
  const isSaved = question.isSaved();
  const query = question?.card().dataset_query?.native?.query || "";
  const debouncedQuery = useDebouncedValue(query, 1000);
  const sql = useMemo(() => {
    return debouncedQuery;
  }, [debouncedQuery]);

  const tips = getSqlOptimize(sql);
  const hasTips = tips && tips?.length > 0;


  useEffect(() => {
    if (!isSaved && !isShow && hasTips) {
      showSqlOptimize();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setIsShow(true);
    }
  }, [isShow, isSaved, showSqlOptimize, hasTips]);
  
  return (
    <Tooltip tooltip={t`How to query faster`}>
      <Button
        className={cx(`ml1 Question-header-btn-new`, {
          "Question-header-btn--primary": isShowingSqlOptimizeSidebar,
        })}
        onlyIcon
        iconColor="#7A819B"
        iconSize={size}
        onClick={() => {
          trackStructEvent("SqlOptimizeButton");
          toggleSqlOptimize();
        }}
      >
        SQL optimize
      </Button>
    </Tooltip>
  );
};

export default SqlOptimizeButton;
