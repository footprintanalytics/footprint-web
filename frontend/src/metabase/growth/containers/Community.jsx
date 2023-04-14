/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { Card, Tag, Avatar, Typography } from "antd";
import { useQuery } from "react-query";
import { Link } from "react-router";
import { getUser, getFgaProject } from "metabase/selectors/user";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import {
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

  const [walletListParams, setWalletListParams] = React.useState({
    pageSize: 10,
    current: 1,
    filters: [],
    quickFilter: [],
  });

  const infoResult = useQuery(
    ["getCommunityInfo", project?.id],
    async () => getCommunityInfo({ projectId: parseInt(project?.id) }),
    { ...QUERY_OPTIONS, enabled: !!project?.id },
  );

  const filterResult = useQuery(
    ["getCommunityQuickFilter", project?.id],
    async () => getCommunityQuickFilter({ projectId: parseInt(project?.id) }),
    { ...QUERY_OPTIONS, enabled: !!project?.id },
  );

  const listResult = useQuery(
    ["getCommunityWalletAddress", project?.id, walletListParams],
    async () =>
      getCommunityWalletAddress({
        ...walletListParams,
        projectId: parseInt(project?.id),
      }),
    { ...QUERY_OPTIONS, enabled: !!project?.id },
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
        sourceDefinitionId: project?.twitter?.sourceDefinitionId,
      });
      dataList.push({
        title: "Discord Members",
        value: data.discordMembers,
        change: data.discordMembersChange,
        sourceDefinitionId: project?.discord?.sourceDefinitionId,
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
      key: "address",
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
            <div className="flex flex-col">
              <Typography.Text>{text}</Typography.Text>
              {record.ens && (
                <Typography.Text type="secondary">{record.ens}</Typography.Text>
              )}
            </div>
          </Link>
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
      render: (text, { twitterAvatar }, index) => (
        <>
          {text ? (
            <>
              <a
                rel="noreferrer"
                href={`https://twitter.com/${text}`}
                target="_blank"
              >
                <div className=" flex flex-row">
                  <Avatar
                    size={25}
                    className="mr1"
                    src={
                      twitterAvatar?.length > 0
                        ? twitterAvatar
                        : `https://xsgames.co/randomusers/assets/avatars/pixel/${
                            index % 50
                          }.jpg`
                    }
                  />
                  {text}
                </div>
              </a>
            </>
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
      render: (text, { discordAvatar }, index) => (
        <>
          {text ? (
            <div className=" flex flex-row">
              <Avatar
                size={25}
                className="mr1"
                src={
                  discordAvatar?.length > 0
                    ? discordAvatar
                    : `https://xsgames.co/randomusers/assets/avatars/pixel/${
                        index % 50
                      }.jpg`
                }
              />
              <Typography.Text ellipsis={true} copyable={true}>
                {text}
              </Typography.Text>
            </div>
          ) : (
            "--"
          )}
        </>
      ),
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

  const getQuickFilterOptionList = data => {
    return data?.map(option => {
      return {
        label: `${option.name} (${option.wallets})`,
        value: option.name,
      };
    });
  };

  return (
    <div className="flex flex-column items-center w-full p2">
      {infoResult.isLoading || filterResult.isLoading || !project?.id ? (
        <Card className="w-full rounded m1" style={{ height: 250 }}>
          <LoadingSpinner message="Loading..." />
        </Card>
      ) : (
        <>
          {!infoResult.isLoading && (
            <StatisticIndex
              data={formatInfoResult(infoResult?.data)}
              project={project}
              refetchData={infoResult.refetch}
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
                current: 1,
              });
            }}
          />
          <QuickFilter
            optionsList={getQuickFilterOptionList(filterResult?.data?.data)}
            onFliterChange={tag => {
              setWalletListParams({
                ...walletListParams,
                current: 1,
                quickFilter: tag ? [tag?.value] : [],
              });
            }}
          />
        </>
      )}
      {listResult.isLoading | !project?.id ? (
        <Card className="w-full rounded m1" style={{ height: 650 }}>
          <LoadingSpinner message="Loading..." />
        </Card>
      ) : (
        <WalletList
          router={router}
          // isLoading={listResult?.isLoading}
          // isRefetching={listResult?.isFetching}
          data={listResult?.data}
          actions={actions}
          onPageChange={(page, pageSize) => {
            setWalletListParams({
              ...walletListParams,
              current: parseInt(page),
              pageSize: parseInt(pageSize),
            });
          }}
          columns={tableColumns}
        />
      )}
    </div>
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
