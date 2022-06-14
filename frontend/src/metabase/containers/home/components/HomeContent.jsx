/* eslint-disable react/prop-types */

import React from "react";
import PreviewList from "metabase/containers/home/components/PreviewList";
import HomeArticles from "metabase/containers/home/components/HomeArticles";
import { Flex } from "grid-styled";

const HomeContent = props => {
  const { recommends, mediaInfos, setShareModalResource } = props;

  if (!recommends || recommends.length === 0) {
    return null;
  }
  return (
    <Flex flexDirection="row">
      <PreviewList
        key={recommends[0].title}
        index={0}
        section={recommends[0]}
        shareAction={entity => {
          setShareModalResource({
            open: true,
            public_uuid: entity.publicUuid,
            type: entity.type,
            name: entity.name,
            id: entity.id,
            creatorId: entity.creatorId,
            uniqueName: entity.uniqueName,
            creator: entity.creator,
          });
        }}
      />
      <HomeArticles mediaInfos={mediaInfos} />
    </Flex>
  );
};

export default HomeContent;
