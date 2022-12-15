/* eslint-disable react/prop-types */
import { Tag } from "antd";
import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import Link from "metabase/core/components/Link";
import { trackStructEvent } from "metabase/lib/analytics";
import {
  getDashboardQueryLink,
  getDashboardQueryTags,
} from "../../shared/utils";

const Item = ({ router, item, closable, searchWords = [] }) => {
  const tags = getDashboardQueryTags(router.location.query.tags);

  return (
    <Tag
      key={item}
      closable={closable}
      onClick={() => trackStructEvent("Dashboards Tag", item)}
      closeIcon={
        <Link
          to={getDashboardQueryLink({
            ...router.location.query,
            current: 1,
            tags: tags.filter(tag => tag !== item),
          })}
        >
          <CloseOutlined />
        </Link>
      }
    >
      #
      <Highlighter
        highlightClassName="highlight"
        searchWords={searchWords}
        autoEscape={true}
        textToHighlight={item}
      />
    </Tag>
  );
};

export default Item;
