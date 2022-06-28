/* eslint-disable react/prop-types */
import React from "react";
import cx from "classnames";
import { getProject, isDefi360 } from "metabase/lib/project_info";

export default function Tag({
  className,
  currentCategory,
  tagList,
  onTagClick,
  tagRightPanel,
}) {
  const project = getProject();

  if (isDefi360(project)) {
    return null;
  }

  return (
    <div
      className={cx(className, "mine__tag")}
      style={project === "defi360" ? { marginTop: 0, paddingTop: 0 } : {}}
    >
      <h3>{currentCategory.title}</h3>
      {!!currentCategory.desc && <p>{currentCategory.desc}</p>}
      <div className="mine__tag-container">
        {tagList && tagList.length > 0 && (
          <ul className="mine__tag-list footprint-secondary-text1">
            {tagList.map(item => (
              <li
                key={item.tag}
                className={item.selected ? "mine__tag-list--selected" : ""}
                onClick={() => onTagClick(item)}
              >
                {item.title}
              </li>
            ))}
          </ul>
        )}
        {tagRightPanel}
      </div>
    </div>
  );
}
