/* eslint-disable react/prop-types */
import React from "react";

export default function Category({
  categoryList,
  onCategoryClick,
  rightPanel,
}) {
  return (
    <div className="explore__category">
      <div>
        <ul className="explore__category-list explore__wrap">
          {categoryList.map(item => (
            <li
              key={item.label}
              className={
                item.selected ? "explore__category-list--selected" : ""
              }
              onClick={() => onCategoryClick(item)}
            >
              {item.label}
            </li>
          ))}
        </ul>
        {rightPanel}
      </div>
    </div>
  );
}
