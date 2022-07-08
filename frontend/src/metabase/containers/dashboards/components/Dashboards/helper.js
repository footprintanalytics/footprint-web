import { Menu } from "antd";
import { trackStructEvent } from "metabase/lib/analytics";
import Favorite from "metabase/containers/explore/components/Favorite";
import IconValue from "metabase/containers/dashboards/components/IconValue";
import React from "react";

export default function getActionMenus({
  onDuplicate,
  record,
  onShare,
  onSeoTagging,
  onHomePriority,
  gaCategory,
  user,
  isAdmin,
  isMarket,
}) {
  return (
    <Menu
      onClick={({ key }) => {
        switch (key) {
          case "duplicate":
            onDuplicate({
              name: record.name,
              description: record.description,
              id: record.id,
              type: record.model,
            });
            break;
          case "share":
            onShare({
              open: true,
              public_uuid: record.publicUuid,
              type: record.model,
              name: record.name,
              id: record.id,
              creatorId: record.creator.id,
              creator: record.creator,
              uniqueName: record.uniqueName || record.unique_name,
            });
            break;
          case "seo":
            onSeoTagging({
              id: record.id,
              name: record.name,
              creatorId: record.creator.id,
            });
            break;
          case "priority":
            onHomePriority({
              id: record.id,
              name: record.name,
            });
            break;
          default:
            break;
        }
        trackStructEvent(`${gaCategory} Action`, key);
      }}
    >
      <Menu.Item key="favorite" style={{ marginLeft: -1 }}>
        <Favorite
          borderless
          className="dashboards__icon-value"
          uuid={record.publicUuid}
          id={record.id}
          type={record.model}
          isLike={record.isFavorite}
          hideNumber={true}
        />
      </Menu.Item>
      {user && (
        <Menu.Item key="duplicate">
          <IconValue iconName="duplicate" value="Copy" />
        </Menu.Item>
      )}
      <Menu.Item key="share">
        <IconValue iconName="share" value="Sharing" />
      </Menu.Item>
      {(isMarket || isAdmin) && (
        <Menu.Item key="seo">
          <IconValue iconName="rose" value="Seo" />
        </Menu.Item>
      )}
      {(isMarket || isAdmin) && (
        <Menu.Item key="priority">
          <IconValue iconName="tool_setting" value="Priority" />
        </Menu.Item>
      )}
    </Menu>
  );
}
