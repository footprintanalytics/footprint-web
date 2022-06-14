/* eslint-disable react/prop-types */
import React from "react";
import cx from "classnames";
import Search from "metabase/containers/explore/components/Search";
import { trackStructEvent } from "metabase/lib/analytics";
import Link from "metabase/components/Link";

export default function Tag({
  className,
  currentCategory,
  tagList,
  currentTag,
  onTagClick,
  onTagSearch,
}) {
  return (
    <div className={cx(className, "explore__tag")}>
      <div className={cx(className, "explore__tag_content")}>
        <div className="footprint-title1">{currentCategory.title}</div>
        {!!currentCategory.desc && (
          <div className="footprint-primary-text">{currentCategory.desc}</div>
        )}
        <Search onTagSearch={onTagSearch} currentTag={currentTag} />
        {tagList && tagList.length > 0 && (
          <ul className="explore__tag-list footprint-secondary-text1">
            {tagList.map(item => (
              <li
                key={item.tag}
                className={item.selected ? "explore__tag-list--selected" : ""}
                onClick={() => {
                  onTagClick(item);
                  trackStructEvent(`tag-search-list-click,${item.tag}`);
                }}
              >
                <Link
                  href={`/explore?q=${item.tag}`}
                  onClick={e => e.preventDefault()}
                >
                  {item.tag}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
