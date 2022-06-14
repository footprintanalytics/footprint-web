/* eslint-disable react/prop-types */
import dayjs from "dayjs";
import Link from "metabase/components/Link";
import { isProduction } from "metabase/env";
import React from "react";
import { articleDetailUrl } from "metabase/lib/urls";

const Item = ({ item, index, textMode = false }) => {
  const url = item.url || articleDetailUrl(item);

  return (
    <div className="dashboards__news-item">
      {!textMode && index === 0 && (
        <Link href={url}>
          <div
            className="dashboards__news-item-thumb"
            style={{
              backgroundImage: `url(${
                isProduction
                  ? item.thumbnail
                  : "https://static.footprint.network/article/5741117e-5ca9-4a65-8e80-b267dcbc0152.jpg"
              })`,
            }}
          />
        </Link>
      )}
      <Link href={url} target="_blank">
        <h3 style={{ WebkitBoxOrient: "vertical" }}>{item.title}</h3>
      </Link>
      <span>
        {/*<CreatorName creatorName={item.creator.name} /> •{" "}*/}
        {dayjs(item.publishTime).format("YYYY-MM-DD")}
      </span>
    </div>
  );
};

export default Item;
