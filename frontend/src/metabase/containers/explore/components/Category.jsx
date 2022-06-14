/* eslint-disable react/prop-types */
import React from "react";

export default function Category({
  categoryList,
  onCategoryClick,
  rightPanel,
}) {
  return (
    <div className="explore__category">
      <div className="explore__wrap">
        <ul className="explore__category-list footprint-primary-text">
          {categoryList.map(item => (
            <a
              key={item.label}
              href={item.seoLink}
              onClick={e => {
                e.preventDefault();
                onCategoryClick(item);
              }}
            >
              <li
                className={
                  item.selected ? "explore__category-list--selected" : ""
                }
              >
                {item.label}
              </li>
            </a>
          ))}
        </ul>
      </div>
      {rightPanel}
    </div>
  );
}
