/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { Card, Tag, Badge } from "antd";
import { useQueries, useQuery } from "react-query";
import { Link } from "react-router";
import { getUser, getFgaProject } from "metabase/selectors/user";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import {
  generateAuthKey,
  getCommunityInfo,
  getCommunityQuickFilter,
  getCommunityWalletAddress,
} from "metabase/new-service";
import { StatisticIndex } from "../components/Community/StatisticIndex";
import { QuickFilter } from "../components/Community/QuickFilter";
import { ValueFilter } from "../components/Community/ValueFilter";
import { WalletList } from "../components/Community/WalletList";
import { getGrowthProjectPath } from "../utils/utils";

const Community = props => {
  const { router, location, children, user, projectPath, menu, project } =
    props;
  //  https://preview.footprint.network/api/v1/fga#/community/CommunityController_list
  //   "filters": [
  //   {
  //     "indicator": "string",
  //     "comparisonSymbol": "gt",
  //     "comparisonValue": 0
  //   }
  // ],

  const [walletListParams, setWalletListParams] = React.useState({
    pageSize: 10,
    current: 1,
    filters: [],
    quickFilter: [],
  });

  const infoResult = useQuery(
    ["getCommunityInfo", project?.id],
    async () => {
      return (
        project?.id &&
        getCommunityInfo({ projectId: parseInt(project?.id) })
      );
    },
    QUERY_OPTIONS,
  );
  const filterResult = useQuery(
    ["getCommunityQuickFilter", project?.id],
    async () => {
      return (
        project?.id &&
        getCommunityQuickFilter({ projectId: parseInt(project?.id) })
      );
    },
    QUERY_OPTIONS,
  );
  const listResult = useQuery(
    ["getCommunityWalletAddress", project?.id, walletListParams],
    async () => {
      return (
        project?.id &&
        getCommunityWalletAddress({
          ...walletListParams,
          projectId: parseInt(project?.id),
        })
      );
    },
    QUERY_OPTIONS,
  );

  function formatInfoResult(data) {
    const dataList = [];
    if (data) {
      dataList.push({
        title: "Wallets",
        value: data.wallets,
        change: data.walletsChange,
      });
      dataList.push({
        title: "Twitter Followers",
        value: data.twitterFollowers,
        change: data.twitterFollowersChange,
      });
      dataList.push({
        title: "Discord Members",
        value: data.discordMembers,
        change: data.discordMembersChange,
      });
    }
    return dataList;
  }

  const valueFilterOptionsList = [
    {
      label: "Net Worth >=",
      indicator: "netWorth",
      comparisonSymbol: "gte",
    },
    {
      label: "NFT Holding Value >=",
      indicator: "nftHoldingValue",
      comparisonSymbol: "gte",
    },
    {
      label: "Token Holding Value >=",
      indicator: "tokenHoldingValue",
      comparisonSymbol: "gte",
    },
    // { label: "Profit >=", indicator: "profit", comparisonSymbol: "gte" },
  ];

  const actions = [
    {
      component: (
        <div
          onClick={() =>
            props.router?.push({
              pathname: getGrowthProjectPath(
                props.router?.params?.project,
                "CreateCampaign",
              ),
            })
          }
        >
          Mapping Now
        </div>
      ),
      title: "Mapping Now", //required
      link: null,
    },
  ];

  const tableColumns = [
    {
      title: "Wallet",
      dataIndex: "address",
      key: "Wallet",
      render: (text, record) => (
        <div className="flex flex-col">
          <Link
            onClick={() => {
              props.router?.push({
                pathname:
                  "/growth/public/dashboard/f7cd2f21-1e14-438d-8820-011418607450",
                query: {
                  wallet_address: text,
                },
                hash: "#from=Community",
              });
            }}
          >
            {text}
          </Link>
          {record.ens && (
            <div>
              {/* <Badge color={"green"} text={} /> */}
              <a href={record.ens} target="_blank" rel="noreferrer">
                {record.ens}
              </a>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags ? (
            <>
              {tags?.map(tag => {
                return <Tag key={tag}>{tag}</Tag>;
              })}
            </>
          ) : (
            <>--</>
          )}
        </>
      ),
    },
    {
      title: "Net Worth",
      dataIndex: "netWorth",
      key: "netWorth",
      render: text => (text ? text.toLocaleString("en-US") : "--"),
    },
    {
      title: "NFT Holding Values",
      dataIndex: "holdingNFTValue",
      key: "holdingNFTValue",
      render: text => (text ? text.toLocaleString("en-US") : "--"),
    },
    {
      title: "Token Holding Values",
      dataIndex: "holdingTokenValue",
      key: "holdingTokenValue",
      render: text => (text ? text.toLocaleString("en-US") : "--"),
    },
    {
      title: "Twitter",
      dataIndex: "twitterName",
      key: "twitterName",
      render: text => (
        <>
          {text ? (
            <a
              rel="noreferrer"
              href={`https://twitter.com/${text}`}
              target="_blank"
            >
              {text}
            </a>
          ) : (
            "--"
          )}
        </>
      ),
    },
    {
      title: "Discord",
      dataIndex: "discordName",
      key: "discordName",
      render: text => text ?? "--",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: text => text ?? "--",
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <a>Invite {record.name}</a>
    //       <a>Delete</a>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <>
      {project?.id ? (
        <div className="flex flex-column items-center w-full p2">
          {infoResult.isLoading || filterResult.isLoading ? (
            <Card className="w-full rounded m1" style={{ height: 250 }}>
              <LoadingSpinner message="Loading..." />
            </Card>
          ) : (
            <>
              {!infoResult.isLoading && (
                <StatisticIndex
                  data={formatInfoResult(infoResult?.data)}
                  router={router}
                />
              )}
              <ValueFilter
                className="mt2"
                data={valueFilterOptionsList}
                onFliterChange={valueFilter => {
                  if (!valueFilter) return;
                  let temp = [...walletListParams.filters];
                  temp = temp.filter(
                    item => item.indicator !== valueFilter.indicator,
                  );
                  if (valueFilter.comparisonValue) {
                    temp.push(valueFilter);
                  }
                  setWalletListParams({
                    ...walletListParams,
                    filters: temp,
                  });
                }}
              />
              <QuickFilter
                data={filterResult?.data?.data}
                onFliterChange={tag => {
                  setWalletListParams({
                    ...walletListParams,
                    quickFilter: tag ? [tag?.value] : [],
                  });
                }}
              />
            </>
          )}
          {listResult.isLoading ? (
            <Card className="w-full rounded m1" style={{ height: 450 }}>
              <LoadingSpinner message="Loading..." />
            </Card>
          ) : (
            <WalletList
              router={router}
              // isLoading={listResult?.isLoading}
              data={listResult?.data}
              actions={actions}
              // isRefetching={listResult?.isFetching}
              columns={tableColumns}
            />
          )}
        </div>
      ) : (
        <LoadingSpinner message="Loading..." />
      )}
    </>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectPath: props?.params?.project,
    projectObject: getFgaProject(state),
    menu: props?.params?.menu,
  };
};

export default connect(mapStateToProps)(Community);
