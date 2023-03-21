/* eslint-disable react/prop-types */
import Link from "metabase/core/components/Link";
import React from "react";
import { trackStructEvent } from "metabase/lib/analytics";
import { allShowText } from "metabase/containers/protocols/shared/config";
import Other from "metabase/containers/protocols/components/Protocols/Other";
import { Select, Spin } from "antd";
import { xor } from "lodash";

const Category2 = ({ categorys = [], router, name, isLoading, title, actives=[], onChange }) => {

  if (isLoading) {
    return (
      <div className="protocols__category-container">
        <Spin />
      </div>
    )
  }

  const otherIgnoreNum = 10 - actives.length;
  const getEnumArray = () => {
    if (otherIgnoreNum < 0) {
      return actives;
    }
    if (actives.length === 0) {
      categorys.slice(0, otherIgnoreNum);
    }
    return [...actives, ...xor(categorys, actives).slice(0, otherIgnoreNum)];
  }

  const getOthers = () => {
    return xor(categorys, getEnumArray());
  }

  const others = getOthers();
  const enumArray = getEnumArray();

  return (
    <div className="protocols__category-container">
      {title && <h3 className="mr2" style={{
        paddingBottom: 4
      }}>{title}</h3>}
      <ul className="protocols__category">
        {enumArray.map(item => (
            <li
              key={item}
              onClick={() => trackStructEvent("Protocols Category", item)}
            >
              <Link
                className={`protocols__category-item ${
                  actives.includes(item) ? "protocols__category-item--active" : ""
                }`}

                onClick={e => {
                  e.preventDefault();
                  if (actives.includes(item)) {
                    onChange(actives.filter(i => i !== item));
                  } else {
                    onChange([...actives, item]);
                  }
                }}
              >
                {item}
              </Link>
            </li>
          ))}
        {others && others.length > 10 && (
          <Select
            className="protocols__sort"
            placeholder="more"
            onChange={value => {
              onChange([...actives, value]);
            }}
          >
            {others.map(item => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        )}
      </ul>
    </div>
  );
};

export default Category2;
