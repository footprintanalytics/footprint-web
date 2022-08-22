/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "./index.css";
import { connect } from "react-redux";
import NftStart from "metabase/containers/nftPage/components/NftStart";
import NftQa from "metabase/containers/nftPage/components/NftQa";
import NftRoles from "metabase/containers/nftPage/components/NftRoles";
import NftHow from "metabase/containers/nftPage/components/NftHow";
import NftManifesto from "metabase/containers/nftPage/components/NftManifesto";
import NftHolder from "metabase/containers/nftPage/components/NftHolder";
import { loginModalShowAction } from "metabase/redux/control";
import SubmitModal from "metabase/containers/nftPage/components/SubmitModal";
import { useQuery } from "react-query";
import { addressActivityInfo } from "metabase/new-service";
import { QUERY_OPTIONS } from "metabase/containers/search/shared/config";

const NftPage = props => {
  const { user, setLoginModalShow } = props;
  const [showModal, setShowModal] = useState();
  const params = {
    type: "nftOnePage",
  };
  const { isLoading, data, refetch } = useQuery(
    ["addressActivityInfo", params],
    async () => {
      return addressActivityInfo(params);
    },
    { ...QUERY_OPTIONS, retry: 0, enabled: !!user },
  );

  const successAction = () => {
    console.log("successAction");
    refetch();
    setShowModal(false);
  };
  console.log("isLoading", isLoading);
  return (
    <>
      <div className="nft-activity">
        <NftStart
          user={user}
          setLoginModalShow={setLoginModalShow}
          setShowModal={setShowModal}
          data={data}
          isLoading={isLoading}
        />
        <NftManifesto />
        <NftRoles />
        <NftHolder />
        <NftHow />
        <NftQa />
        {showModal && <SubmitModal successAction={successAction} />}
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  user: state.currentUser,
});

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(NftPage);
