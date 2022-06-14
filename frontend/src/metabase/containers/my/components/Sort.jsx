/* eslint-disable react/prop-types */
import React from "react";
import Icon from "metabase/components/Icon";
import Link from "metabase/components/Link";

export default function Sort({ items, onSortClick }) {
  return (
    <div className="mine__sort">
      {items &&
        items.map(item => {
          return (
            <Link
              key={item.name}
              className="mine__sort-item"
              onClick={() => {
                onSortClick && onSortClick(item);
              }}
            >
              <Icon
                name={`${item.sort === "desc" ? item.svgDown : item.svgUp}`}
                size={16}
                color="#79819B"
              />
            </Link>
          );
        })}
    </div>
  );
}
