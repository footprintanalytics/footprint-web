/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Card, Tag, Avatar, Typography, Button, Tooltip } from "antd";
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
import CreateCohort2 from "metabase/growth/containers/PotentialUsers/CreateFliterCohort";
import { StatisticIndex } from "../components/Community/StatisticIndex";
import { QuickFilter } from "../components/Community/QuickFilter";
import { ValueFilter } from "../components/Community/ValueFilter";
import { WalletList } from "../components/Community/WalletList";
import { getGrowthProjectPath } from "../utils/utils";
const Community = props => {
  const { router, location, children, user, projectPath, menu, project } =
    props;

  const [walletListParams, setWalletListParams] = React.useState({
    pageSize: location.query?.pageSize
      ? parseInt(location.query?.pageSize)
      : 10,
    current: location.query?.page ? parseInt(location.query?.page) : 1,
    quickFilter: location.query?.quickFilter
      ? [location.query?.quickFilter.replace("+", " ")]
      : [],
    filters: location.query?.filters ? JSON.parse(location.query?.filters) : [],
  });

  useEffect(() => {
    router.replace({
      pathname: location.pathname,
      query: {
        ...location.query,
        page: walletListParams.current,
        pageSize: walletListParams.pageSize,
        quickFilter: walletListParams.quickFilter,
        filters: JSON.stringify(walletListParams.filters),
      },
    });
  }, [walletListParams]);

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
      defaultValue:
        walletListParams?.filters?.find(item => item.indicator === "netWorth")
          ?.comparisonValue ?? null,
    },
    {
      label: "NFT Holding Value >=",
      indicator: "nftHoldingValue",
      comparisonSymbol: "gte",
      defaultValue:
        walletListParams?.filters?.find(
          item => item.indicator === "nftHoldingValue",
        )?.comparisonValue ?? null,
    },
    {
      label: "Token Holding Value >=",
      indicator: "tokenHoldingValue",
      comparisonSymbol: "gte",
      defaultValue:
        walletListParams?.filters?.find(
          item => item.indicator === "tokenHoldingValue",
        )?.comparisonValue ?? null,
    },
    // { label: "Profit >=", indicator: "profit", comparisonSymbol: "gte" },
  ];

  const actions = [
    {
      title: "Create Cohort",
      component: <CreateCohort2 disable={true} project={project} />,
    },
    {
      component: (
        <Button
          type="text"
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
        </Button>
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
        <div className="flex flex-row">
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
              <Typography.Text>
                {String(text).slice(0, 4) + "..." + String(text).slice(-4)}
              </Typography.Text>
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
          {tags?.length > 0 ? (
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
      align: "right",
      render: text =>
        text !== null ? "$" + text.toLocaleString("en-US") : "--",
    },
    {
      title: "NFT Holding Values",
      dataIndex: "holdingNFTValue",
      key: "holdingNFTValue",
      align: "right",
      render: text =>
        text !== null ? "$" + text.toLocaleString("en-US") : "--",
    },
    {
      title: "Token Holding Values",
      dataIndex: "holdingTokenValue",
      key: "holdingTokenValue",
      align: "right",
      render: text =>
        text !== null ? "$" + text.toLocaleString("en-US") : "--",
    },
    {
      title: "Twitter",
      dataIndex: "twitterName",
      key: "twitterName",
      render: (text, { twitterAvatar, twitterHandler }, index) => (
        <>
          {text?.length > 0 ? (
            <>
              <a
                rel="noreferrer"
                href={`https://twitter.com/${twitterHandler ?? text}`}
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
                  <Typography.Text
                    style={{ maxWidth: 120 }}
                    ellipsis={{
                      tooltip: text,
                    }}
                  >
                    {text}
                  </Typography.Text>
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
          {text?.length > 0 ? (
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
              <Typography.Text
                style={{ maxWidth: 120 }}
                ellipsis={{
                  tooltip: text,
                }}
                copyable={true}
              >
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
      render: text => {
        const mail = text;
        return mail?.length > 0 ? (
          <Tooltip title={mail}>
            <Avatar
              size={25}
              style={{ backgroundColor: "#fff" }}
              src={
                "https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220516201357.png"
              }
            ></Avatar>
          </Tooltip>
        ) : (
          " -- "
        );
      },
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
            defaultValue={
              walletListParams.quickFilter?.length > 0
                ? walletListParams.quickFilter[0]
                : null
            }
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
