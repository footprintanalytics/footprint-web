/* eslint-disable react/prop-types */
import React from "react";
import Highlighter from "react-highlight-words";

const PageBox = ({ router, searchWords, item }) => {
  const formatBodyContent = body => {
    return body
      ?.map(text => {
        const result = text.replaceAll("<em>", "").replaceAll("</em>", "");
        return result.endsWith(".")
          ? result.concat("..")
          : result.concat("...");
      })
      ?.join();
  };
  return (
    <>
      <div
        className="dashboards__web-content"
        style={{ WebkitBoxOrient: "vertical" }}
      >
        <Highlighter
          highlightClassName="highlight"
          searchWords={searchWords}
          autoEscape={true}
          textToHighlight={
            formatBodyContent(item?.highlight?.body_content?.slice(0, 2)) ||
            item?.body_content
          }
        />
      </div>
      <div className="dashboards__web-url">{`${item.url_host}${item.url_path}`}</div>
    </>
  );
};

export default PageBox;
