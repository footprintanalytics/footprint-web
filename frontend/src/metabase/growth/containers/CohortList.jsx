/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { useQuery } from "react-query";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { getUser } from "metabase/selectors/user";
import { GetMemberInfo } from "metabase/new-service";
import LoadingSpinner from "metabase/components/LoadingSpinner/LoadingSpinner";
import SegmentListPanel from "../components/SegmentListPanel";
import { StatisticIndex } from "../components/Community/StatisticIndex";

const CohortList = props => {
  const infoResult = useQuery(
    ["GetMemberInfo", props.project?.id],
    async () => GetMemberInfo({ projectId: parseInt(props.project?.id) }),
    { ...QUERY_OPTIONS, enabled: !!props.project?.id },
  );

  function formatInfoResult(data) {
    const dataList = [];
    if (data) {
      if (data.numberOfActiveWallets >= 0) {
        dataList.push({
          title: "Unique Active Wallet",
          value: data.numberOfActiveWallets,
          change: 0,
        });
      }
      if (data.numberOfNFTHolder >= 0) {
        dataList.push({
          title: "NFT Holder",
          value: data.numberOfNFTHolder,
          change: 0,
        });
      }
      if (data.nftHolderActivity >= 0) {
        dataList.push({
          title: "NFT Holder/UAW %",
          value: data.nftHolderActivity,
          valueSuffix: "%",
          change: 0,
        });
      }
      if (data.numberOfWhale >= 0) {
        dataList.push({
          title: "Whale",
          value: data.numberOfWhale,
          change: 0,
        });
      }
      if (data.numberOfLoyalUser >= 0) {
        dataList.push({
          title: "Loyal User",
          value: data.numberOfLoyalUser,
          change: 0,
        });
      }

      if (data.numberOfHighTradingActiveUser >= 0) {
        dataList.push({
          title: "High-trading Active User",
          value: data.numberOfHighTradingActiveUser,
          change: 0,
        });
      }
    }
    return dataList;
  }

  return (
    <div style={{ padding: 20 }}>
      <>
        {!infoResult.isLoading ? (
          <StatisticIndex
            data={formatInfoResult(infoResult?.data)}
            project={props.project}
            refetchData={infoResult.refetch}
            router={props.router}
          />
        ) : (
          <div style={{ height: 140 }}>
            <LoadingSpinner></LoadingSpinner>
          </div>
        )}
      </>
      <SegmentListPanel
        router={props.router}
        sourceType={"projectUser"}
      ></SegmentListPanel>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(CohortList);
