/* eslint-disable import/no-unresolved */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
// import Recommend from "metabase/containers/news/components/Recommend";
import Flash from "metabase/containers/news/components/Flash";
// import KeepAliveControls from "metabase/hoc/KeepAliveControls";
import ArticleHot from "metabase/containers/news/components/ArticleHot";

const Featured = props => {
  // const { router } = props;
/*
  useEffect(() => {
    router.replace("/news/articles");
  }, [router]);*/

  const [loadedMediaData, setLoadedMediaData] = useState(false);
  return (
    <div className="news-articles__featured">
      <div style={{ flex: 1, maxWidth: 1000 }}>
        {/*<Recommend type="article" />*/}
        {/*<Recommend
          title="Daily News"
          type="dailyNews"
          seeAllLink="/news/daily-news"
          icon="recommendDailyNews"
        />*/}
        <Flash
          {...props}
          loadedMediaData={loaded => {
            setLoadedMediaData(loaded);
          }}
        />
      </div>
      {loadedMediaData && <ArticleHot />}
    </div>
  );
};

// export default KeepAliveControls("flash")(Featured);
export default Featured;
