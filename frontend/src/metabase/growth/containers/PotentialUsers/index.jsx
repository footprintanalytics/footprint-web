/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import "../../css/index.css";
import "./index.css";
import { push } from "react-router-redux";
import { connect } from "react-redux";
import { Alert, Card, Typography } from "antd";
import { useQuery } from "react-query";
import { orderBy } from "lodash";
import { WalletList } from "metabase/growth/components/Community/WalletList";
import LoadingSpinner from "metabase/components/LoadingSpinner/LoadingSpinner";
import { QuickFilter } from "metabase/growth/components/Community/QuickFilter";
import { getFgaProject, getUser } from "metabase/selectors/user";
import CreateCohort2 from "metabase/growth/containers/PotentialUsers/CreateFliterCohort";
import {
  getPotentialUseFilterProject,
  queryPotentialUser,
  getPotentialUserFilterCollection,
  getPotentialUserFilterTag,
} from "metabase/new-service";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import Link from "metabase/core/components/Link/Link";
import { formatTableTitle } from "metabase/lib/formatting/footprint";
import { ItemFilter } from "./ItemFilter";
import { valueFormat } from "metabase/growth/utils/utils";

const PotentialUsers = props => {
  const { router, location, project } = props;

  const [walletListParams, setWalletListParams] = React.useState({
    pageSize: 10,
    current: 1,
    filters: [],
    tags: location?.query?.tag
        ? [location?.query?.tag.replace("+", " ")]
        : [],
    protocolSlugs: [],
    collectionSlugs: [],
    excludeTags: [],
  });

  // const [walletListParams, setWalletListParams] = React.useState({
  //   pageSize: location.query?.pageSize
  //     ? parseInt(location.query?.pageSize)
  //     : 10,
  //   current: location.query?.page ? parseInt(location.query?.page) : 1,
  //   filters: location.query?.filters ? JSON.parse(location.query?.filters) : [],
  //   tag: location.query?.tag
  //     ? [location.query?.tag.replace("+", " ")]
  //     : [],
  //   protocolSlugs: [],
  //   collectionSlugs: [],
  //   excludeTags: [],
  // });
  //
  // useEffect(() => {
  //   router.replace({
  //     pathname: location.pathname,
  //     query: {
  //       ...location.query,
  //       page: walletListParams.current,
  //       pageSize: walletListParams.pageSize,
  //       tag: walletListParams.tag,
  //       filters: JSON.stringify(walletListParams.filters),
  //     },
  //   });
  // }, [walletListParams]);

  const filterProjectResult = useQuery(
    ["getPotentialUseFilterProject", project?.id],
    async () => {
      return getPotentialUseFilterProject({ projectId: parseInt(project?.id) });
    },
    { ...QUERY_OPTIONS, enabled: !!project?.id },
  );

  const filterCollectionResult = useQuery(
    ["getPotentialUserFilterCollection", project?.id],
    async () => {
      return getPotentialUserFilterCollection({
        projectId: parseInt(project?.id),
      });
    },
    { ...QUERY_OPTIONS, enabled: !!project?.id },
  );

  const filterTagResult = useQuery(
    ["getPotentialUserFilterTag", project?.id],
    async () => {
      return getPotentialUserFilterTag({ projectId: parseInt(project?.id) });
    },
    { ...QUERY_OPTIONS, enabled: !!project?.id },
  );

  const listResult = useQuery(
    ["queryPotentialUser", project?.id, walletListParams],
    async () => {
      return queryPotentialUser({
        ...walletListParams,
        projectId: parseInt(project?.id),
      });
    },
    { ...QUERY_OPTIONS, enabled: !!project?.id },
  );

  const actions = [
    {
      title: "Create Cohort",
      component: (
        <CreateCohort2
          project={project}
          addressListCount={listResult?.data?.total}
          params={{
            ...walletListParams,
            projectId: parseInt(project?.id),
          }}
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
          {/* <Avatar
            size={35}
            className="mr1"
            src={
              twitterAvatar?.length > 0
                ? twitterAvatar
                : discordAvatar?.length > 0
                ? discordAvatar
                : `https://xsgames.co/randomusers/assets/avatars/pixel/${
                    index % 50
                  }.jpg`
            }
          /> */}
          <Link
            to={`/growth/public/dashboard/f7cd2f21-1e14-438d-8820-011418607450?wallet_address=${text}#from=Community`}
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
      render: text => (text !== null ? "$" + valueFormat(text) : ""),
    },
    {
      title: "NFT Holding Values",
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
      render: text => (text !== null ? "$" + valueFormat(text) : ""),
    },
    {
      title: "Token Holding Values",
      dataIndex: "holdingTokenValue",
      key: "holdingTokenValue",
      align: "right",
      render: text => (text !== null ? "$" + valueFormat(text) : ""),
    },
    {
      title: "Total NFT Transaction(30D)",
      dataIndex: "totalNFTTransaction",
      key: "totalNFTTransaction",
      align: "right",
      render: text => (text !== null ? "$" + valueFormat(text) : ""),
    },
    {
      title: "Total Transactions(30D)",
      dataIndex: "totalTransactions",
      key: "Total Transactions",
      align: "right",
      render: text => (text !== null ? "$" + valueFormat(text) : ""),
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
      <>
        <div className="my2 ml1">
          {"With this feature, you'll be able to:"}
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
        </div>
      </>
    );
    return (
      <div style={{ padding: 6 }}>
        <Card>
          <Alert message={message} showIcon />
        </Card>
      </div>
    );
  };

  return (
    <>
      {project?.id ? (
        <div className="flex flex-column w-full p2">
          {renderHint()}
          {filterProjectResult?.isLoading &&
          filterCollectionResult?.isLoading &&
          listResult?.isLoading &&
          filterTagResult?.isLoading ? (
            <Card className="w-full rounded m1" style={{ height: 150 }}>
              <LoadingSpinner message="Loading..." />
            </Card>
          ) : (
            <>
              <ItemFilter
                className="mt2"
                projectData={orderBy(filterProjectResult?.data?.data, ["name"])}
                collectionData={orderBy(filterCollectionResult?.data?.data, [
                  "name",
                ])}
                onSelectChange={selectObject => {
                  setWalletListParams({
                    ...walletListParams,
                    ...selectObject,
                    current: 1,
                  });
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
              <QuickFilter
                title={"Tag"}
                titleWidth={"68px"}
                defaultValue={location?.query?.tag}
                optionsList={getQuickFilterOptionList(
                  orderBy(filterTagResult?.data?.data, ["tag"]),
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
            </>
          )}
          {listResult.isLoading ? (
            <Card className="w-full rounded m1" style={{ height: 650 }}>
              <LoadingSpinner message="Loading..." />
            </Card>
          ) : (
            <WalletList
              router={router}
              // isLoading={listResult?.isLoading}
              data={listResult?.data}
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
