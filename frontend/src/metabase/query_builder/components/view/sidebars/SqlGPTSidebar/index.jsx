/* eslint-disable react/prop-types */
import React, { useMemo } from "react";
import { t } from "ttag";
import SidebarContent from "metabase/query_builder/components/SidebarContent";
import { useDebouncedValue } from "metabase/hooks/use-debounced-value";
import SqlGPTContent from "./compoment/SqlGPTContent";

const SqlGPTSidebar = ({
  onClose,
  question,
  updateQuestion,
  runQuestionQuery,
  query,
}) => {
  const nativeQuery = question?.card().dataset_query?.native?.query || "";
  const debouncedQuery = useDebouncedValue(nativeQuery, 1000);
  const sql = useMemo(() => {
    return debouncedQuery;
  }, [debouncedQuery]);

  return (
    <SidebarContent
      className="full-height chart-side-bar__char-type"
      title={t`SQL Assistant`}
      onClose={onClose}
    >
      <SqlGPTContent
        sql={sql}
        updateQuestion={updateQuestion}
        runQuestionQuery={runQuestionQuery}
        question={question}
        databaseId={query.databaseId()}
      />
    </SidebarContent>
  );
};


export default SqlGPTSidebar;
