/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import "./index.css";
import { LeftCircleFilled, RightCircleFilled } from "@ant-design/icons";
import { trackStructEvent } from "metabase/lib/analytics";
import { useDeviceInfo } from "metabase-lib/lib/Device";
import Item from "./Item";

const List = ({ recommends, gaCategory = "Create Campaign" }) => {
  const [left, setLeft] = useState(0);
  const ref = useRef(null);
  const { isPC } = useDeviceInfo();

  const showPrev = left !== 0;
  const showNext =
    left !== ref.current?.scrollWidth - ref.current?.clientWidth &&
    recommends.length > 4;

  const handleArrow = arrow => {
    ref.current.scrollTo({
      left: arrow === "prev" ? 0 : left + (288 + 28) * (isPC ? 4 : 1),
      behavior: "smooth",
    });
    trackStructEvent(gaCategory, arrow);
  };

  return (
    <div className="campaign__list-wrap">
      {showPrev && (
        <div
          className="campaign__list-prev"
          onClick={() => handleArrow("prev")}
        >
          <LeftCircleFilled />
        </div>
      )}
      <ul
        className="campaign__list-list"
        ref={ref}
        onScroll={() => setLeft(ref.current.scrollLeft)}
      >
        {recommends.map(item => (
          <li
            key={item.configId}
            onClick={() => {
              trackStructEvent(gaCategory, item.name);
            }}
          >
            <Item item={item} />
          </li>
        ))}
      </ul>
      {showNext && (
        <div
          className="campaign__list-next"
          onClick={() => handleArrow("next")}
        >
          <RightCircleFilled />
        </div>
      )}
    </div>
  );
};

export default List;
