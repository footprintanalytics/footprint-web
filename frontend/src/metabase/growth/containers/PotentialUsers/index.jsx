/* eslint-disable react/prop-types */
import React from "react";
import "../../css/index.css";
import "./index.css";
import CreateCohort2 from "metabase/growth/containers/PotentialUsers/CreateFliterCohort";
import { push } from "react-router-redux";
import { getFgaProject, getUser } from "metabase/selectors/user";
import { connect } from "react-redux";
import { QuickFilter } from "metabase/growth/components/Community/QuickFilter";
import { ItemFilter } from "./ItemFilter";
import { WalletList } from "metabase/growth/components/Community/WalletList";
import { Card } from "antd";
import LoadingSpinner from "metabase/components/LoadingSpinner/LoadingSpinner";
import { useQuery } from "react-query";
import {
  getPotentialUseFilterProject,
  getPotentialUser,
  getPotentialUserFilterCollection,
  getPotentialUserFilterTag,
} from "metabase/new-service";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { Link } from "react-router";
import { formatTableTitle } from "metabase/lib/formatting/footprint";

const PotentialUsers = props => {
  const { router, project } = props;


  const [walletListParams, setWalletListParams] = React.useState({
    pageSize: 10,
    current: 1,
    filters: [],
    tags:[],
    protocolSlugs: [],
    collectionSlugs: [],
  });

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
      return getPotentialUserFilterCollection({ projectId: parseInt(project?.id) });
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
    ["getPotentialUser", project?.id, walletListParams],
    async () => {
      return getPotentialUser({
        ...walletListParams,
        projectId: parseInt(project?.id),
      });
    },
    { ...QUERY_OPTIONS, enabled: !!project?.id },
  );

  const actions = [
    {
      title: "Create Cohort",
      label: (<CreateCohort2 project={project}> </CreateCohort2>),
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
      title: "Net Worth",
      dataIndex: "netWorth",
      key: "netWorth",
      render: text => (text ? text.toLocaleString("en-US") : "--"),
    },
    {
      title: "NFT Holding",
      dataIndex: "holdingNFT",
      key: "holdingNFT",
      render: text => (text ? text.toLocaleString("en-US") : "--"),
    },
    {
      title: "NFT Holding Values",
      dataIndex: "holdingNFTValue",
      key: "holdingNFTValue",
      render: text => (text ? text.toLocaleString("en-US") : "--"),
    },
    {
      title: "Token Holding",
      dataIndex: "holdingToken",
      key: "holdingToken",
      render: text => (text ? text.toLocaleString("en-US") : "--"),
    },
    {
      title: "Token Holding Values",
      dataIndex: "holdingTokenValue",
      key: "holdingTokenValue",
      render: text => (text ? text.toLocaleString("en-US") : "--"),
    },
    {
      title: "Total NFTTransaction",
      dataIndex: "totalNFTTransaction",
      key: "totalNFTTransaction",
      render: text => (text ? text.toLocaleString("en-US") : "--"),
    },
    {
      title: "Total Transactions",
      dataIndex: "totalTransactions",
      key: "Total Transactions",
      render: text => (text ? text.toLocaleString("en-US") : "--"),
    },
  ];

  const getQuickFilterOptionList = (data) => {
    return data?.map(option => {
      return {
        label: option.tag,
        value: option.tag,
      };
    });
  }

  return (
    <>
      {project?.id ? (
        <div className="flex flex-column items-center w-full p2">
          {filterProjectResult?.isLoading &&
          filterCollectionResult?.isLoading &&
          listResult?.isLoading &&
          filterTagResult?.isLoading ? (
            <Card className="w-full rounded m1" style={{ height: 250 }}>
              <LoadingSpinner message="Loading..." />
            </Card>
          ) : (
            <>
              <ItemFilter
                className="mt2"
                projectData={filterProjectResult?.data?.data}
                collectionData={filterCollectionResult?.data?.data}
                onSelectChange={selectObject => {
                  setWalletListParams({
                    ...walletListParams,
                    ...selectObject,
                    current: 1,
                  });
                }}
                onFilterChange={valueFilter => {
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
                optionsList={getQuickFilterOptionList(
                  filterTagResult?.data?.data,
                )}
                formatFunction={name =>
                  formatTableTitle(name?.replace(/-/g, " "))
                }
                onFilterChange={tag => {
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
