/* eslint-disable react/prop-types */
import React from "react";
import Highlighter from "react-highlight-words";
import "../DataSet/Index.css";
import { Popover } from "antd";

const dataSetBox = ({ router, searchWords, item, isPlain = false }) => {
  const data = item?.field_names?.replace(/"/g, "")?.split(",");
  if (!data) {
    return null;
  }
  console.log("isPlain", isPlain);
  const render = () => {
    console.log("11");
    let isMore = false;
    if (data.length > 5) {
      isMore = true;
    }
    const content = (
      <div className="dataset__field-grid-container">
        {data?.map(field => {
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
    );
    return (
      <div className="dataset__field-grid-container">
        {data?.slice(0, 5)?.map(field => {
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
        {isMore && (
          <Popover content={content} title="Fields" trigger="hover">
            <div
              className="dataset__field-grid-item"
              style={{ width: "100%", textAlign: "center", margin: "0 auto" }}
            >
              ...
            </div>
          </Popover>
        )}
      </div>
    );
  };

  if (isPlain) {
    return render();
  }

  return (
    <>
      <div className="dataset__field-grid-container">
        {data?.map(field => {
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
