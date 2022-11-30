/* eslint-disable react/prop-types */
import { Select } from "antd";
import React from "react";
import { getDashboardQueryLink } from "metabase/containers/protocols/shared/utils";

const Other = ({ categorys, name, router }) => {
  const queryKey = `${name.toLowerCase()}`;
  const category = router.location.query[queryKey] || "";

  if (!categorys || categorys.length === 0) {
    return null;
  }

  const getUrl = item => {
    const routeParams = { ...router.location.query, current: 1 };
    routeParams[queryKey] = item;
    return getDashboardQueryLink(routeParams);
  };

  return (
    <Select
      value={category && categorys.includes(category) ? category : "more"}
      className="protocols__sort"
      placeholder="more"
      onChange={value => {
        router.push(getUrl(value));
      }}
    >
      {categorys.map(item => (
        <Select.Option key={item} value={item}>
          {item}
        </Select.Option>
      ))}
    </Select>
  );
};

export default Other;
