/* eslint-disable react/prop-types */
import Link from "metabase/core/components/Link";
import React from "react";
import { trackStructEvent } from "metabase/lib/analytics";
import { Select } from "antd";
import { xor, union } from "lodash";
import LoadingSpinner from "metabase/components/LoadingSpinner/LoadingSpinner";

const CategoryForFga = ({ data = [], isLoading, title, actives=[], onChange }) => {
  const categorys = union(actives, data);
  const otherIgnoreNum = 6 - actives.length;
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

  const formatTitle = title => {
    return title
      ?.replace(/_wallets$/g, "")
      ?.replace(/_wallet$/g, "")
      ?.replace(/_users$/g, "")
      ?.replace(/_user$/g, "");
  }

  return (
    <div className="protocols__category-container">
      {title && <h3 className="mr2" style={{
        paddingBottom: 4
      }}>{title}</h3>}
      {isLoading ? (<LoadingSpinner size={16}/>) :
        (
          enumArray.length === 0 ? "No Column to filter on" :
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
                  {formatTitle(item)}
                </Link>
              </li>
            ))}
            {others && others.length > 0 && (
              <Select
                className="protocols__sort"
                value="more"
                placeholder="more"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => (option?.value?.toLowerCase() ?? '').includes(input.toLowerCase())}
                onChange={value => {
                  onChange([...actives, value]);
                }}
              >
                {others.map(item => (
                  <Select.Option key={item} value={item}>
                    {formatTitle(item)}
                  </Select.Option>
                ))}
              </Select>
            )}
          </ul>
        )}
    </div>
  );
};

export default CategoryForFga;
