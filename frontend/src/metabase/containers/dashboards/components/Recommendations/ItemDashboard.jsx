/* eslint-disable react/prop-types */
import React from "react";
import IconValue from "../IconValue";
import { getOssUrl } from "metabase/lib/image";
import { ossPath } from "metabase/lib/ossPath";
import { isProduction } from "metabase/env";
import ItemCommon from "./ItemCommon";
import Favorite from "metabase/containers/explore/components/Favorite";
import * as Urls from "metabase/lib/urls";

const ItemDashboard = ({ item, showStat = true }) => {
  const fileName =
    (isProduction ? ossPath(item.mode) : item.mode) +
    "/" +
    (isProduction
      ? item.modelId
      : item.mode === "dashboard"
      ? "1002"
      : "7511") +
    ".png";

  const getUrl = () => {
    if (item.mode === "dashboard") {
      return Urls.dashboard(item);
    }
    return Urls.guestUrl({ ...item, type: item.mode });
  };

  return (
    <>
      <ItemCommon
        url={getUrl()}
        thumb={getOssUrl(fileName, { resize: true })}
        name={item.name}
      />
      {showStat && (
        <div className="dashboards__recommendations-stat">
          <IconValue iconName="read" value={item.statistics.view} />
          <Favorite
            borderless
            className="dashboards__icon-value"
            uuid={item.publicUuid}
            id={item.modelId}
            type="dashboard"
            like={item.statistics.favorite}
            isLike={item.isFavorite}
          />
        </div>
      )}
    </>
  );
};

export default ItemDashboard;
