/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import Step from "../Step";
import "./index.css";
import { useMutation } from "react-query";
import { checkTableName, uploadCSVConfirm } from "metabase/new-service";
import { getProject } from "metabase/lib/project_info";
import { mockPrepareData } from "../../utils/mock";
import TableName from "./TableName";
import TablePreview from "./TablePreview";
import { useDebounce } from "ahooks";

const Confirm = ({
  prepareData = mockPrepareData,
  onPrev,
  onNext,
  onPrepareDataChange,
}) => {
  const project = getProject();

  const [tableName, setTableName] = useState(prepareData.tableName);
  const checkMutate = useMutation(checkTableName);
  const confirmMutate = useMutation(uploadCSVConfirm);
  const debouncedTableName = useDebounce(tableName, { wait: 500 });

  useEffect(() => {
    if (!debouncedTableName) return;
    checkMutate.mutate({ tableName: debouncedTableName });
  }, [debouncedTableName]);

  return (
    <Step
      title="Step 2 of 2: Make sure the data looks right"
      desc="Please make sure that Footprint interprets your data correctly."
      onPrev={onPrev}
      onNext={async () => {
        try {
          const { tableName, storageName, tableSchema } = prepareData;
          const params = { tableName, storageName, tableSchema, project };
          await confirmMutate.mutateAsync(params);
          onNext();
        } catch (error) {}
      }}
      nextText={checkMutate.isLoading ? "Checking" : "Finish Upload"}
      disabledNext={!tableName || checkMutate.data?.result === 1}
      loadingNext={checkMutate.isLoading || confirmMutate.isLoading}
    >
      <div className="custom-upload__confirm">
        <TableName
          value={tableName}
          message={checkMutate.data?.message}
          onChange={value => {
            setTableName(value);
            onPrepareDataChange({ ...prepareData, tableName: value });
          }}
        />
        <TablePreview
          prepareData={prepareData}
          onPrepareDataChange={onPrepareDataChange}
        />
      </div>
    </Step>
  );
};

export default Confirm;
