/* eslint-disable react/prop-types */
import React from "react";
import Table from "../Table";

const TablePreview = ({ prepareData, onPrepareDataChange }) => {
  return (
    <>
      <h3>
        Data Preview (Top {prepareData.tablePartData.length - 1} rows shown)
      </h3>
      <Table
        prepareData={prepareData}
        hideVerify={true}
        canEdit={true}
        onPrepareDataChange={onPrepareDataChange}
      />
    </>
  );
};

export default TablePreview;
