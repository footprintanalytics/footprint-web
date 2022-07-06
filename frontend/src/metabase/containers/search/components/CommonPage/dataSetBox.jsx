/* eslint-disable react/prop-types */
import React from "react";
import Highlighter from "react-highlight-words";
import "../DataSet/Index.css";

const dataSetBox = ({ router, searchWords, item }) => {
  return (
    <>
      <div className="dataset__field-grid-container">
        {item?.field_names?.split(",")?.map(field => {
          return (
            <div key={field} className="dataset__field-grid-item">
              <Highlighter
                highlightClassName="highlight"
                searchWords={searchWords}
                autoEscape={true}
                textToHighlight={field}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default dataSetBox;
