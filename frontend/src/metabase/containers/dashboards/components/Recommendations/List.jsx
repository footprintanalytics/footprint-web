/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import "./index.css";
import Item from "./Item";
import { trackStructEvent } from "metabase/lib/analytics";
import { LeftCircleFilled, RightCircleFilled } from "@ant-design/icons";
import { useDeviceInfo } from "metabase-lib/lib/Device";

const List = ({ recommends, target }) => {
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
    trackStructEvent("Dashboards Recommendations", arrow);
  };

  return (
    <div className="dashboards__recommendations-wrap">
      {showPrev && (
        <div
          className="dashboards__recommendations-prev"
          onClick={() => handleArrow("prev")}
        >
          <LeftCircleFilled />
        </div>
      )}
      <ul
        className="dashboards__recommendations-list"
        ref={ref}
        onScroll={() => setLeft(ref.current.scrollLeft)}
      >
        {recommends.map(item => (
          <li
            key={item.configId}
            onClick={() => {
              trackStructEvent("Dashboards Recommendations", item.name);
            }}
          >
            <Item item={item} target={target} />
          </li>
        ))}
      </ul>
      {showNext && (
        <div
          className="dashboards__recommendations-next"
          onClick={() => handleArrow("next")}
        >
          <RightCircleFilled />
        </div>
      )}
    </div>
  );
};

export default List;
