import React from "react";
import Table from "../Table";
import { mockTablePartData, mockTableSchema } from "../../utils/mock";

const Info = () => {
  return (
    <div className="custom-upload__prepare-info">
      <h3>General Info:</h3>
      <ul>
        <li>
          Data size should be less than <b>50 MB</b> and the number of rows
          should be less than <b>1 Million</b>
        </li>
        <li>
          The data should be within <b>30 columns</b>
        </li>
        <li>
          Field and file name may only contain lowercase letters, numbers, and
          underscores
        </li>
        <li>The data will be visible to everyone</li>
      </ul>
      <Table
        prepareData={{
          tableSchema: mockTableSchema,
          tablePartData: mockTablePartData,
        }}
      />
    </div>
  );
};

export default Info;
