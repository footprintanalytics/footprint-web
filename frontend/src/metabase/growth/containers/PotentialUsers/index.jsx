/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from "react";
import "../../css/index.css";
import "./index.css";
import { push } from "react-router-redux";
import { connect } from "react-redux";
import { Alert, Card, Input, Radio, Typography, Space } from "antd";
import { useQuery } from "react-query";
import { omit, orderBy, union } from "lodash";
import { WalletList } from "metabase/growth/components/Community/WalletList";
import LoadingSpinner from "metabase/components/LoadingSpinner/LoadingSpinner";
import { QuickFilter } from "metabase/growth/components/Community/QuickFilter";
import { getFgaProject, getUser } from "metabase/selectors/user";
import CreateCohort2 from "metabase/growth/containers/PotentialUsers/CreateFliterCohort";
import {
  getPotentialUseFilter,
  getPotentialUserFilterFeaturedTag,
  queryPotentialUserByFilter,
} from "metabase/new-service";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import Link from "metabase/core/components/Link/Link";
import { formatTableTitle } from "metabase/lib/formatting/footprint";
import { formatTag, valueFormat } from "metabase/growth/utils/utils";
import { wallet_profile_link } from "metabase/growth/utils/data";
import { ItemFilter } from "./ItemFilter";

const PotentialUsers = props => {
  const { router, location, project } = props;

  const visibleCount = 3;

  const [walletListParams, setWalletListParams] = React.useState({
    pageSize: 10,
    current: 1,
    filters: [],
  });

  const [walletListData, setWalletListData] = React.useState(null);
  const [otherOptionsList, setOtherOptionsList] = React.useState([])
  const [selectMoreValue, setSelectMoreValue] = React.useState([])

  const filterResult = useQuery(
    ["getPotentialUseFilter"],
    async () => {
      return getPotentialUseFilter();
    },
    { ...QUERY_OPTIONS },
  );

  const filterFeaturedTagResult = useQuery(
    ["getPotentialUserFilterFeaturedTag", project?.id],
    async () => {
      return getPotentialUserFilterFeaturedTag({ projectId: parseInt(project?.id) });
    },
    { ...QUERY_OPTIONS, enabled: !!project?.id },
  );

  const listResult = useQuery(
    ["queryPotentialUserByFilter", project?.id, walletListParams],
    async () => {
      return queryPotentialUserByFilter({
        ...mergeFiltersByTags(walletListParams),
        projectId: parseInt(project?.id),
      });
    },
    { ...QUERY_OPTIONS, enabled: !!project?.id },
  );

  React.useEffect(() => {
    if (!listResult?.isLoading) {
      setWalletListData(listResult?.data);
    }
  }, [listResult]);

  React.useEffect(() => {
    if (visibleFilterResultData && otherOptionsList) {
      const allList = [...visibleFilterResultData, ...otherOptionsList].map(y => y.indicator);
      setWalletListParams({
        ...walletListParams,
        filters: [...walletListParams?.filters?.filter(i => allList?.includes(i?.indicator))],
        current: 1,
      });
    }
  }, [otherOptionsList, visibleFilterResultData]);

  // tags must convert and merge to filters.tags
  const mergeFiltersByTags = (params) => {
    let tags = params?.tags || [];
    const filters = params?.filters || [];
    let tagFilter = filters?.find(i => i.indicator === "tags");
    if (tagFilter && tags?.length > 0) {
      tags = union([...tagFilter.comparisonValue, ...tags])
    }
    if (tags?.length > 0) {
      tagFilter = {
        indicator: "tags",
        comparisonSymbol: "in",
        comparisonValue: tags
      }
    }
    const fixFilters = [
      ...filters.filter(i => i.indicator !== "tags"),
    ]
    if (tagFilter) {
      fixFilters.push(tagFilter);
    }
    return {
      ...omit(params, ["tags"]),
      filters: fixFilters,
    };
  }

  const actions = [
    {
      title: "Create Cohort",
      component: (
        <CreateCohort2
          project={project}
          router={router}
          addressListCount={listResult?.data?.total}
          params={{
            ...mergeFiltersByTags(walletListParams),
            projectId: parseInt(project?.id),
          }}
          isButtonStyle={false}
        />
      ),
    },
  ];

  const tableColumns = [
    {
      title: "Address",
      dataIndex: "address",
      key: "Wallet",
      render: (text, { ens, discordAvatar, twitterAvatar }, index) => (
        <div className="flex flex-row">
          <Link
            to={`${wallet_profile_link}?wallet_address=${text}#from=Potential User`}
          >
            <div className="flex flex-col">
              {String(text).slice(0, 4) + "..." + String(text).slice(-4)}
              {ens && <Typography.Text type="secondary">{ens}</Typography.Text>}
            </div>
          </Link>
        </div>
      ),
    },
    {
      title: "Tag",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => {
        tags = tags?.map(i => formatTag(i));
        return (
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
            {tags?.length > 0 ? (
              <>
                {tags?.join(", ")}
                {/* {tags?.map(tag => {
              return (
                <Tag
                  className="rounded"
                  style={{ margin: 2.5, fontSize: 8, display: "inline" }}
                  key={tag}
                >
                  {tag}
                </Tag>
              );
            })} */}
              </>
            ) : (
              <></>
            )}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: "Net Worth",
      dataIndex: "netWorth",
      key: "netWorth",
      align: "right",
      render: text => (text !== null ? "$" + valueFormat(text) : ""),
    },
    {
      title: "NFT Holding",
      dataIndex: "holdingNFT",
      key: "holdingNFT",
      align: "right",
      render: text => (text !== null ? valueFormat(text) : ""),
    },
    {
      title: "NFT Holding Value",
      dataIndex: "holdingNFTValue",
      key: "holdingNFTValue",
      align: "right",
      render: text => (text !== null ? "$" + valueFormat(text) : ""),
    },
    {
      title: "Token Holding",
      dataIndex: "holdingToken",
      key: "holdingToken",
      align: "right",
      render: text => (text !== null ? valueFormat(text) : ""),
    },
    {
      title: "Token Holding Value",
      dataIndex: "holdingTokenValue",
      key: "holdingTokenValue",
      align: "right",
      render: text => (text !== null ? "$" + valueFormat(text) : ""),
    },
    {
      title: "Trading Value(30D)",
      dataIndex: "tradingValue",
      key: "tradingValue",
      align: "right",
      render: text => (text !== null ? "$" + valueFormat(text) : ""),
    },
    {
      title: "Total NFT Transactions(30D)",
      dataIndex: "totalNFTTransaction",
      key: "totalNFTTransaction",
      align: "right",
      render: text => (text !== null ? valueFormat(text) : ""),
    },
    {
      title: "Total Transactions(30D)",
      dataIndex: "totalTransactions",
      key: "Total Transactions",
      align: "right",
      render: text => (text !== null ? valueFormat(text) : ""),
    },
  ];

  const getQuickFilterOptionList = data => {
    return data?.map(option => {
      return {
        label: option.tag,
        value: option.tag,
      };
    });
  };

  const renderHint = () => {
    const message = (
      <Alert
        message="With this feature, you'll be able to"
        description={
          <ul style={{ listStyle: "inside" }}>
            <li>
              Gain access to and analyze over 120 million wallet profiles and
              tags.
            </li>
            <li>
              Identify valuable users from the top NFTs, protocols, and chains.
            </li>
            <li>
              {
                "Dive deep into analyzing target audiences' holding value and activities on the chain."
              }
            </li>
          </ul>
        }
        type="info"
        showIcon
      />
    );
    return (
      <div style={{ padding: 6 }}>
        <Card>{message}</Card>
      </div>
    );
  };

  const filterResultData = filterResult?.data;
  const visibleFilterResultData = filterResultData?.slice(0, visibleCount);
  const otherFilterResultData = filterResultData?.slice(visibleCount, filterResultData?.length);
  const moreFilterResultData = filterResultData ? [{
    label: "More",
    type: "more",
    options: [
      {
        label: "Recent",
        options: filterResultData?.slice(visibleCount, visibleCount + 1)?.map(i => {
          return {
            value: i?.indicator,
            label: i?.label,
          };
        }) || [],
      },
      {
        label: "Hot",
        options: filterResultData?.slice(visibleCount + 1, filterResultData?.length)?.map(i => {
          return {
            value: i.indicator,
            label: i.label,
          };
        }) || [],
      },
    ],
  }] : [];

  return (
    <>
      {project?.id ? (
        <div className="flex flex-column w-full p2">
          {renderHint()}
          {
          filterFeaturedTagResult?.isLoading &&
          filterResult?.isLoading ? (
            <Card className="w-full rounded m1" style={{ height: 150 }}>
              <LoadingSpinner message="Loading..." />
            </Card>
          ) : (
            <>
              <QuickFilter
                title={"Tags"}
                defaultValue={location?.query?.tag}
                optionsList={getQuickFilterOptionList(
                  orderBy(filterFeaturedTagResult?.data?.data, ["tag"]),
                )}
                formatFunction={name =>
                  formatTableTitle(name?.replace(/-/g, " "))
                }
                onFliterChange={tag => {
                  setWalletListParams({
                    ...walletListParams,
                    current: 1,
                    tags: tag ? [tag?.value] : [],
                  });
                }}
              />
              <ItemFilter
                className="mt2"
                filterResultData={filterResult?.data}
                visibleFilterResultData={visibleFilterResultData}
                moreFilterResultData={moreFilterResultData}
                selectMoreValue={selectMoreValue}
                onSelectChange={selectObject => {
                  const finalSelectObject = selectObject?.comparisonValue ? [selectObject] : []
                  setWalletListParams({
                    ...walletListParams,
                    filters: [...walletListParams?.filters?.filter(i => i.indicator !== selectObject.indicator), ...finalSelectObject],
                    current: 1,
                  });
                }}
                enableMoreSelect={true}
                onMoreChange={(value) => {
                  setSelectMoreValue(value);
                  setOtherOptionsList(value.map(item => {
                    return otherFilterResultData?.find(a => a.indicator === item)
                  }));
                }}
                onFilterChange={valueFilter => {
                  if (!valueFilter) {
                    return;
                  }
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
              <ItemFilter
                className="mb1"
                onSelectChange={selectObject => {
                  const finalSelectObject = selectObject?.comparisonValue ? [selectObject] : []
                  setWalletListParams({
                    ...walletListParams,
                    filters: [...walletListParams?.filters?.filter(i => i.indicator !== selectObject.indicator), ...finalSelectObject],
                    current: 1,
                  });
                }}
                titleColor="transparent"
                visibleFilterResultData={otherOptionsList}
                isOtherFilter={true}
                onFilterChange={valueFilter => {
                  if (!valueFilter) {
                    return;
                  }
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
                onCloseAction={item => {
                  setSelectMoreValue(selectMoreValue.filter(i => i !== item.indicator))
                  setOtherOptionsList(otherOptionsList.filter(i => i.indicator !== item.indicator))
                }}
              />
            </>
          )}
          {listResult.isLoading && !walletListData ? (
            <Card className="w-full rounded m1" style={{ height: 650 }}>
              <LoadingSpinner message="Loading..." />
            </Card>
          ) : (
            <WalletList
              router={router}
              isLoading={listResult?.isLoading}
              data={walletListData}
              actions={actions}
              onPageChange={(page, pageSize) => {
                setWalletListParams({
                  ...walletListParams,
                  current: parseInt(page),
                  pageSize: parseInt(pageSize),
                });
              }}
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

const mapDispatchToProps = {
  onChangeLocation: push,
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectPath: props?.params?.project,
    projectObject: getFgaProject(state),
    menu: props?.params?.menu,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PotentialUsers);
