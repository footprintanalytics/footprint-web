/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Card, Tag, Avatar, Typography, Button, Tooltip } from "antd";
import { useQuery } from "react-query";
import Link from "metabase/core/components/Link/Link";
import { getUser, getFgaProject } from "metabase/selectors/user";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import {
  getCommunityInfo,
  getCommunityQuickFilter,
  getCommunityWalletAddress,
} from "metabase/new-service";
import CreateCohort2 from "metabase/ab/containers/PotentialUsers/CreateFliterCohort";
import { StatisticIndex } from "../components/Community/StatisticIndex";
import { QuickFilter } from "../components/Community/QuickFilter";
import { ValueFilter } from "../components/Community/ValueFilter";
import { WalletList } from "../components/Community/WalletList";
import { formatTag, getGrowthProjectPath, valueFormat } from "../utils/utils";
import { wallet_profile_link } from "../utils/data";
import { formatTitle } from "metabase/lib/formatting/footprint";
const Community = props => {
  const { router, location, children, user, projectPath, menu, project, businessType } =
    props;
  const projectId = "1"
  const protocolSlug = project?.protocolSlug
  const [walletListParams, setWalletListParams] = useState({
    pageSize: location.query?.pageSize
      ? parseInt(location.query?.pageSize)
      : 10,
    current: location.query?.page ? parseInt(location.query?.page) : 1,
    quickFilter: location.query?.quickFilter
      ? [location.query?.quickFilter.replace("+", " ")]
      : [],
    filters: location.query?.filters ? JSON.parse(location.query?.filters) : [],
  });
  const [queryType, setQueryType] = useState(null);
  const [walletListData, setWalletListData] = useState(null);

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

  // const infoResult = useQuery(
  //   ["getCommunityInfo", project?.id],
  //   async () => getCommunityInfo({ projectId: parseInt(project?.id) }),
  //   { ...QUERY_OPTIONS, enabled: !!project?.id },
  // );

  // const filterResult = useQuery(
  //   ["getCommunityQuickFilter", project?.id],
  //   async () => getCommunityQuickFilter({ projectId: parseInt(project?.id) }),
  //   { ...QUERY_OPTIONS, enabled: !!project?.id },
  // );

  const listResult = useQuery(
    ["getCommunityWalletAddress", projectId, walletListParams],
    async () =>
      getCommunityWalletAddress({
        ...walletListParams,
        projectId: parseInt(projectId),
      }),
    { ...QUERY_OPTIONS, enabled: !!projectId },
  );

  useEffect(() => {
    if (!listResult?.isLoading) {
      setWalletListData(listResult?.data);
    }
  }, [listResult]);

  // function formatInfoResult(data) {
  //   const dataList = [];
  //   if (data) {
  //     dataList.push({
  //       title: "Addresses",
  //       value: data.wallets,
  //       change: data.walletsChange,
  //     });
  //     dataList.push({
  //       title: "Twitter Followers",
  //       value: data.twitterFollowers,
  //       change: data.twitterFollowersChange,
  //       sourceDefinitionId: project?.twitter?.sourceDefinitionId,
  //     });
  //     dataList.push({
  //       title: "Discord Members",
  //       value: data.discordMembers,
  //       change: data.discordMembersChange,
  //       sourceDefinitionId: project?.discord?.sourceDefinitionId,
  //     });
  //   }
  //   return dataList;
  // }

  const valueFilterOptionsList = [
    {
      label: "Wallet Age >=",
      indicator: "walletAge",
      comparisonSymbol: "gte",
      defaultValue:
        walletListParams?.filters?.find(item => item.indicator === "walletAge")
          ?.comparisonValue ?? null,
    },
    {
      label: "Total Value >=",
      indicator: "totalValue",
      comparisonSymbol: "gte",
      defaultValue:
        walletListParams?.filters?.find(item => item.indicator === "totalValue")
          ?.comparisonValue ?? null,
    },
    // {
    //   label: "In-Game NFT Holding Value >=",
    //   indicator: "nftHoldingValue",
    //   comparisonSymbol: "gte",
    //   defaultValue:
    //     walletListParams?.filters?.find(
    //       item => item.indicator === "nftHoldingValue",
    //     )?.comparisonValue ?? null,
    // },
    // {
    //   label: "In-Game Token Holding Value >=",
    //   indicator: "tokenHoldingValue",
    //   comparisonSymbol: "gte",
    //   defaultValue:
    //     walletListParams?.filters?.find(
    //       item => item.indicator === "tokenHoldingValue",
    //     )?.comparisonValue ?? null,
    // },
    // {
    //   label: "In-Game Trading Value(30D) >=",
    //   indicator: "tradingValue",
    //   comparisonSymbol: "gte",
    //   defaultValue:
    //     walletListParams?.filters?.find(
    //       item => item.indicator === "tradingValue",
    //     )?.comparisonValue ?? null,
    // },
    // { label: "Profit >=", indicator: "profit", comparisonSymbol: "gte" },
  ];

  const actions = [
    /*{
      title: "Create Campaigns",
      disabled: false,
      component: (
        <Tooltip title="Create campaigns using the filtered users.">
          <Button
            type="primary"
            onClick={() => {
              router.push({
                pathname: getGrowthProjectPath(
                  protocolSlug,
                  "quest",
                ),
              });
            }}
          >
            <div>Create Campaigns</div>
          </Button>
        </Tooltip>
      ),
    },*/
    {
      title: "Create Segment",
      disabled: false,
      component: (

          <CreateCohort2
            disable={false}
            project={project}
            router={router}
            btnText="Save as Segment"
            type="Members"
            businessType={businessType}
            addressListCount={listResult?.data?.total}
            params={{
              ...walletListParams,
              projectId: 53,
            }}
            isButtonStyle={true}
          />
      ),
    },
    {
      title: "My Segments",
      disabled: false,
      component: (
        <Tooltip title="Display our segment records.">
          <Button
            type="primary"
            onClick={() => {
              router.push({
                pathname: getGrowthProjectPath(
                  protocolSlug,
                  "segment",
                ),
              });
            }}
          >
            <div>My Segments</div>
          </Button>
        </Tooltip>
      ),
    },
    /*{
      component: (
        <Button
          type="primary"
          // className="p0"
          onClick={() =>
            props.router?.push({
              pathname: getGrowthProjectPath(
                props.router?.params?.project,
                "id_connect",
              ),
            })
          }
        >
          ID Connect
        </Button>
      ),
      title: "Social Connect", //required
      link: null,
      disabled: false,
    },*/
  ];
  const tableColumns = [
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text, { ens }) => (
        <div className="flex flex-row">
          <div
            // to={`${wallet_profile_link}?wallet_address=${text}#from=Community`}
          >
            <div className="flex flex-col">
              {String(text).slice(0, 4) + "..." + String(text).slice(-4)}
              {ens && <Typography.Text type="secondary">{ens}</Typography.Text>}
            </div>
          </div>
        </div>
      ),
    },
    /*{
      title: "Tag",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => {
        tags = tags?.map(i => formatTag(i));
        const tagStr = tags?.map(t => formatTitle(t)).join(", ");
        return (
          <Tooltip title={tagStr} placement="topLeft">
            <Typography.Paragraph
              ellipsis={{
                rows: 2,
                expandable: true,
                suffix: "",
                symbol: "more",
              }}
              style={{
                minWidth: 150,
                maxWidth: 500,
                fontSize: 10,
                marginBottom: 0,
              }}
            >
              {tags?.length > 0 ? <>{tagStr}</> : <></>}
            </Typography.Paragraph>
          </Tooltip>
        );
      },
    },*/
    {
      title: "Not Active Days",
      dataIndex: "not_active_days",
      key: "not_active_days",
      align: "right",
      render: text => (text !== null ? valueFormat(text) : ""),
    },
    {
      title: "Wallet Age",
      dataIndex: "wallet_age",
      key: "wallet_age",
      align: "right",
      render: text => (text !== null ? valueFormat(text) : ""),
    },
    {
      title: "Total Value",
      dataIndex: "total_value",
      key: "total_value",
      align: "right",
      render: text => (text !== null ? valueFormat(text) : ""),
    },
    {
      title: "Total Altcoin Token Value",
      dataIndex: "total_altcoin_token_value",
      key: "total_altcoin_token_value",
      align: "right",
      render: text => (text !== null ? valueFormat(text) : ""),
    },
    {
      title: "Total Native Token Value",
      dataIndex: "total_native_token_value",
      key: "total_native_token_value",
      align: "right",
      render: text => (text !== null ? valueFormat(text) : ""),
    },
    {
      title: "Total NFT Value",
      dataIndex: "total_nft_value",
      key: "total_nft_value",
      align: "right",
      render: text => (text !== null ? valueFormat(text) : ""),
    },
    {
      title: "Number of Txn",
      dataIndex: "number_of_txn",
      key: "number_of_txn",
      align: "right",
      render: text => (text !== null ? valueFormat(text) : ""),
    },
    {
      title: "Total Gas Fee Spent in USD",
      dataIndex: "total_gas_fee_spent_in_usd",
      key: "total_gas_fee_spent_in_usd",
      align: "right",
      render: text => (text !== null ? "$" + valueFormat(text) : ""),
    },
    /*{
      title: "In-Game Tokens",
      dataIndex: "holdingToken",
      key: "holdingToken",
      align: "right",
      render: text => (text !== null ? valueFormat(text) : ""),
    },
    {
      title: "In-Game Token Value",
      dataIndex: "holdingTokenValue",
      key: "holdingTokenValue",
      align: "right",
      render: text => (text !== null ? "$" + valueFormat(text) : ""),
    },
    {
      title: "In-Game Trading Value(30D)",
      dataIndex: "tradingValue",
      key: "tradingValue",
      align: "right",
      render: text => (text !== null ? "$" + valueFormat(text) : ""),
    },
    {
      title: "Total In-Game NFT Transactions(30D)",
      dataIndex: "totalNFTTransaction",
      key: "totalNFTTransaction",
      align: "right",
      render: text => (text !== null ? valueFormat(text) : ""),
    },
    {
      title: "Total In-Game Transactions(30D)",
      dataIndex: "totalTransactions",
      key: "totalTransactions",
      align: "right",
      render: text => (text !== null ? valueFormat(text) : ""),
    },*/
    /*{
      title: "Social ID",
      dataIndex: "twitterName",
      key: "socialId",
      render: (
        text2,
        {
          twitterAvatar,
          twitterHandler,
          twitterName,
          discordName,
          discordAvatar,
          email,
        },
        index,
      ) => (
        <>
          {(twitterName?.length > 0 || twitterHandler?.length > 0) && (
            <>
              <a
                rel="noreferrer"
                href={`https://twitter.com/${twitterHandler ?? twitterName}`}
                target="_blank"
              >
                <div className="mt1 flex flex-row">
                  <Avatar
                    size={25}
                    className="mr1"
                    style={{ backgroundColor: "#fff" }}
                    src="https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220516201254.png"
                  />
                  <Typography.Text
                    style={{ maxWidth: 150 }}
                    ellipsis={{
                      tooltip: twitterName ?? twitterHandler,
                    }}
                  >
                    {twitterName ?? twitterHandler}
                  </Typography.Text>
                </div>
              </a>
            </>
          )}
          {discordName?.length > 0 && (
            <div className="mt1 flex flex-row">
              <Avatar
                size={25}
                className="mr1"
                style={{ backgroundColor: "#fff" }}
                src="https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220516201343.png"
              />
              <Typography.Text
                style={{ maxWidth: 150 }}
                ellipsis={{
                  tooltip: discordName,
                }}
              >
                {discordName}
              </Typography.Text>
            </div>
          )}
          {email?.length > 0 && (
            <div className="mt1 flex flex-row">
              <Avatar
                size={25}
                className="mr1"
                style={{ backgroundColor: "#fff" }}
                src={
                  "https://footprint-imgs.oss-us-east-1.aliyuncs.com/icon_email.png"
                }
              />
              <Typography.Text
                style={{ maxWidth: 150 }}
                ellipsis={{
                  tooltip: email,
                }}
              >
                {email.replace("qq.com", "gmail.com")}
              </Typography.Text>
            </div>
          )}
        </>
      ),
    },*/
  ];

  const getQuickFilterOptionList = data => {
    return data?.map(option => {
      return {
        label: `${option.name}`,
        value: option.name,
      };
    });
  };

  return (
    <div className="flex flex-column items-center w-full p2">
      {/* {infoResult.isLoading || !project?.id ? (
        <div className="w-full p1">
          <Card className="w-full rounded" style={{ height: 140 }}>
            <LoadingSpinner />
          </Card>
        </div>
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
        </>
      )} */}
      {/*{filterResult.isLoading || !project?.id ? (*/}
      {/*  <div className="w-full p1">*/}
      {/*    <Card className="w-full rounded" style={{ height: 110 }}>*/}
      {/*      <LoadingSpinner />*/}
      {/*    </Card>*/}
      {/*  </div>*/}
      {/*) : (*/}
      {/*  <>*/}
          <ValueFilter
            className="mt1"
            isLoading={queryType === "valueFilter" && listResult.isLoading}
            data={valueFilterOptionsList}
            onFliterChange={valueFilter => {
              if (!valueFilter) return;
              setQueryType("valueFilter");
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
          {/*<QuickFilter
            isLoading={queryType === "quickFilter" && listResult.isLoading}
            optionsList={getQuickFilterOptionList(filterResult?.data?.data)}
            defaultValue={
              walletListParams.quickFilter?.length > 0
                ? walletListParams.quickFilter[0]
                : null
            }
            onFliterChange={tag => {
              setQueryType("quickFilter");
              setWalletListParams({
                ...walletListParams,
                current: 1,
                quickFilter: tag ? [tag?.value] : [],
              });
            }}
          />*/}
      {/*  </>*/}
      {/*)}*/}
      {listResult.isLoading | !projectId && walletListData === null ? (
        <div className="w-full p1">
          <Card className="w-full rounded" style={{ height: 650 }}>
            <LoadingSpinner />
          </Card>
        </div>
      ) : (
        <WalletList
          router={router}
          isLoading={listResult?.isLoading}
          // isRefetching={listResult?.isFetching}
          data={walletListData}
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
