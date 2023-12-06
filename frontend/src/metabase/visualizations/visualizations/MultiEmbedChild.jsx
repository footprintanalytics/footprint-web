/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import URLParse from 'url-parse';
import querystring from "querystring";
import ItemEmbed from "metabase/containers/dashboards/components/Recommendations/ItemEmbed";

const MultiEmbedChild = props => {
  const { settings, onChange, user } = props;
  const text = settings.text;
  const search = window.location.search;
  const [items, setItems] = useState();

  useEffect(() => {
    const items = parseText(text, search);
    setItems(items);
  }, [setItems, text, search]);

  const parseText = (text, search) => {
    if (!text) {
      return [];
    }
    try {
      let items = JSON.parse(text);
      if (items?.length <= 0) {
        return null;
      }
      items = items.map(item => {
        let url = item.url;
        const isFootprintPage = item?.url?.startsWith("https://www.footprint.network")
        if (isFootprintPage && search) {
          const queryUrl = new URLParse(item.url)
          const searchParams = querystring.parse(search?.replace("?", ""));
          const otherQueryParams = querystring.parse(queryUrl.query?.replace("?", ""));
          const mergedQueryParams = Object.assign({}, otherQueryParams, searchParams);
          queryUrl.set('query', mergedQueryParams);
          url = queryUrl.toString();
        }
        return {
          label: item.label,
          key: item.key,
          url: url,
          closable: true,
          children: (
            <ItemEmbed
              className="w-full flex-full"
              item={{ mediaUrl: url }}
              user={user}
            />
          ),
        };
      });
      return items;
    } catch (error) {
      console.log("renderEmbed error", error);
      return [];
    }
  }

  const renderEmbed = ({ settings }) => {
    if (items?.length <= 0) {
      return null;
    }
    return (
      <div className="full flex-full flex flex-column h-full">
        <Tabs
          type="card"
          className="w-full h-full"
          onChange={onChange}
          items={items}
        />
      </div>
    );
  };

  if (!settings.text) {
    return null;
  }

  return renderEmbed({ settings })
}

export default MultiEmbedChild;
