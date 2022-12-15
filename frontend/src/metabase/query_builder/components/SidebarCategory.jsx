/* eslint-disable react/prop-types */
import React from "react";
import "./SidebarCategory.css";
import cx from "classnames";

export default function SidebarCategory({ categoryList, categoryListSelect }) {
  const currentItem = categoryList && categoryList.find(item => item.selected);

  return (
    <div className="side-bar-category">
      {categoryList.map(item => {
        return (
          <span
            key={item.value}
            className={cx("side-bar-category__item", {
              "side-bar-category__item-selected":
                currentItem.value === item.value,
            })}
            onClick={() => {
              categoryListSelect && categoryListSelect(item);
            }}
          >
            {item.title}
          </span>
        );
      })}
    </div>
  );
}
