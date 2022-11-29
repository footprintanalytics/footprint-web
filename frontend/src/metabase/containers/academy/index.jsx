/* eslint-disable react/prop-types */
import React from "react";
import Category from "./components/Category";
import "../explore/index.css";
import "./index.css";
import "../dashboards/index.css";
import Box from "./components/Box";
import { useQuery } from "react-query";
import { tutorialsMenu } from "metabase/new-service";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import News from "metabase/containers/dashboards/components/News";
import { compose } from "underscore";
import MetaViewportControls from "metabase/dashboard/hoc/MetaViewportControls";
import { Skeleton } from "antd";
import "../dashboards/components/Recommendations/index.css";
import { trackStructEvent } from "metabase/lib/analytics";
import title from "metabase/hoc/Title";

const Academy = ({ router }) => {
  const { category } = router?.location?.query;

  const { isLoading, data: categoryData } = useQuery(
    ["tutorialsMenu"],
    async () => {
      return await tutorialsMenu();
    },
    QUERY_OPTIONS,
  );

  if (isLoading) {
    return <Skeleton style={{ maxWidth: "1440px", margin: "0 auto" }} active />;
  }

  const selectCategory =
    categoryData?.list?.find(item => item.value === category) ||
    (categoryData?.list && categoryData?.list[0]);

  return (
    <div className="edu bg-gray">
      {/*<Recommendations />*/}
      <Category
        categoryList={categoryData?.list}
        selectCategory={selectCategory}
        onCategoryClick={item => {
          trackStructEvent(`academy click category ${item.value}`);
          router.push(`academy?category=${item.value}`);
        }}
      />
      {selectCategory && (
        <div className="edu__layout">
          <div className="edu__body">
            <Box router={router} selectCategory={selectCategory} />
          </div>
          <div className="edu__layout-side">
            <News model="realTimeInfo" title="Flash" />
          </div>
        </div>
      )}
    </div>
  );
};

export default compose(MetaViewportControls, title())(Academy);
