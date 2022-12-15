/* eslint-disable react/prop-types */
import React from "react";
import "../Protocols/index.css";
import Category from "metabase/containers/protocols/components/Protocols/Category";
import { useQuery } from "react-query";
import { getLandingCategory } from "metabase/new-service";
import { QUERY_OPTIONS } from "metabase/containers/protocols/shared/config";
import { Skeleton } from "antd";

const Filter = ({ router, user }) => {
  const { isLoading, data } = useQuery(
    ["getLandingProjectCategory", "protocol"],
    async () => {
      return getLandingCategory("protocol");
    },
    QUERY_OPTIONS,
  );

  if (isLoading) {
    return <Skeleton active />;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="protocols__filter">
      <Category
        categorys={["", ...data.category]}
        router={router}
        name="category"
      />
      <Category categorys={["", ...data.chains]} router={router} name="chain" />
      <Category categorys={["", ...data.genres]} router={router} name="genre" />
    </div>
  );
};

export default Filter;
