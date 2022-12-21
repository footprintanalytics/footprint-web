/* eslint-disable react/prop-types */
import React, { useMemo } from "react";
import { t } from "ttag";
import SidebarContent from "metabase/query_builder/components/SidebarContent";
import { useDebouncedValue } from "metabase/hooks/use-debounced-value";
import SqlOptimizeContent from "./compoment/SqlOptimizeContent";

const SqlOptimizeSidebar = ({
  onClose,
  question,
}) => {
  const query = question?.card().dataset_query?.native?.query || "";
  const debouncedQuery = useDebouncedValue(query, 1000);
  const sql = useMemo(() => {
    return debouncedQuery;
  }, [debouncedQuery]);

  return (
    <SidebarContent
      className="full-height chart-side-bar__char-type"
      title={t`How to query faster`}
      onClose={onClose}
    >
      <SqlOptimizeContent sql={sql}/>
    </SidebarContent>
  );
};


export default SqlOptimizeSidebar;
