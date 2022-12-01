/* eslint-disable react/prop-types */
/* eslint-disable curly */
import { Skeleton } from "antd";
import React from "react";
import "./index.css";
import Step from "../customUpload/components/Step";
import Table from "./components/Table";
import TableName from "./components/TableName";
import Code from "./components/Code";
import { useDataset, useTableName, usePreview } from "./shared/hook";
import Result from "../customUpload/components/Result";
import * as Urls from "metabase/lib/urls";

const Index = ({ card, query, router, user }) => {
  const { isLoading, dataset } = useDataset({ card });
  const { tableName, setTableName } = useTableName({ dataset, user });
  const {
    complieRes,
    executeRes,
    edit,
    submit,
    running,
    submitted,
  } = usePreview({ dataset, user });

  if (!card) return null;

  return (
    <div className="buffet">
      {!submitted ? (
        <>
          <Step
            title="One Step: Add Columns"
            desc="You can add columns at will for data analysis."
            hidePrev={true}
            nextText={running ? "Loading..." : "Save Table"}
            hideNext={!tableName || !executeRes}
            loadingNext={running}
            onNext={() => submit(tableName)}
          >
            {isLoading || !dataset ? (
              <Skeleton active />
            ) : (
              <TableName value={tableName} onChange={setTableName} />
            )}
            {!executeRes ? (
              <Skeleton active />
            ) : (
              <Table
                dataset={dataset}
                running={running}
                query={query}
                executeRes={executeRes}
                onChange={edit}
                onError={() => {}}
              />
            )}
          </Step>
          {executeRes && complieRes ? <Code value={complieRes} /> : null}
        </>
      ) : (
        <Result
          prepareData={{ tableName }}
          onNext={() => router.replace(Urls.newQuestion())}
        />
      )}
    </div>
  );
};

export default Index;
