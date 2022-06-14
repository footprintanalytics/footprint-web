/* eslint-disable react/prop-types */

import React from "react";
import Tags from "metabase/containers/protocols/components/Tags";
import { IconBack } from "metabase/components/IconBack";

const DetailHead = ({ router, protocol }) => {
  const { logo, protocol_name, tokenInfos, chains, genres } = protocol;
  return (
    <div className="project-detail__head">
      <div className="project-detail__head-container">
        <div className="project-detail__head-info">
          <div className="flex align-center mb2">
            <IconBack router={router} url="/protocols" />
            <img className="project-detail__head-icon" src={logo} alt="" />
            <span className="project-detail__head-info-name">
              {protocol_name}
            </span>
          </div>

          {!!tokenInfos?.length && (
            <div className="project-detail__about">
              <span>Token</span>
              <Tags
                className="protocols__tags-v2"
                router={router}
                list={tokenInfos.map(token => token.token_symbol)}
                name="token"
              />
            </div>
          )}
          {!!chains?.length && (
            <div className="project-detail__about">
              <span>Chain</span>
              <Tags
                className="protocols__tags-v2"
                router={router}
                list={chains}
                name="chain"
              />
            </div>
          )}
          {!!genres?.length && (
            <div className="project-detail__about">
              <span>Genre</span>
              <Tags
                className="protocols__tags-v2"
                router={router}
                list={genres}
                name="genre"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailHead;
