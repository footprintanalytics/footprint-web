/* eslint-disable react/display-name */
import { Avatar } from "antd";
import Link from "metabase/components/Link";
import React from "react";
import Tags from "../Tags";
import { protocolsDetailUrl } from "metabase/lib/urls";
import { trackStructEvent } from "metabase/lib/analytics";
import { formatTitle } from "metabase/lib/formatting";
import { get } from "lodash";

const colors = ["#E4E4FE", "#D9F8F3", "#FFF5D9", "#FFDFE8"];

export default ({ router }) => {
  const getUrl = record => {
    return protocolsDetailUrl({
      title: `${record.type} ${record.protocol_name}`,
      protocolId: record.protocol_id,
    });
  };
  const name = {
    title: "Name",
    key: "protocol_name",
    dataIndex: "protocol_name",
    width: 400,
    render: (_, record, index) => {
      const backgroundColor = colors[index % colors.length];
      const logo = get(record, "logo");
      return (
        <Link
          onClick={() => trackStructEvent("Protocols Name", record.name)}
          className="protocols__table-name"
          to={getUrl(record)}
          // target="_blank"
        >
          {logo ? (
            <img src={logo} height={24} width={24} alt={record.protocol_name} />
          ) : (
            <Avatar size="small" style={{ backgroundColor }} />
          )}
          <div className="protocols__table-name-info">
            <h3 style={{ WebkitBoxOrient: "vertical" }}>
              {formatTitle(record.protocol_name)}
            </h3>
            <span className="protocols__table-name-info-creator">
              {get(record, "creator.name")}
            </span>
          </div>
        </Link>
      );
    },
  };
  const chain = {
    title: "Chains",
    key: "chains",
    dataIndex: "chains",
    width: 400,
    render: chains => {
      return chains.length ? (
        <Tags router={router} list={chains.slice(0, 10)} name="chain" />
      ) : (
        "-"
      );
    },
  };
  const genre = {
    title: "Genres",
    key: "genres",
    dataIndex: "genres",
    width: 400,
    render: genre => {
      return genre.length ? (
        <Tags router={router} list={genre.slice(0, 10)} name="genre" />
      ) : (
        "-"
      );
    },
  };
  const token = {
    title: "Tokens",
    key: "tokenInfos",
    dataIndex: "tokenInfos",
    width: 400,
    render: tokenInfos => {
      return tokenInfos?.length ? (
        <Tags
          router={router}
          list={tokenInfos?.slice(0, 10)?.map(token => token.token_symbol)}
          name="tokenInfo"
        />
      ) : (
        "-"
      );
    },
  };
  return [name, token, chain, genre];
};
