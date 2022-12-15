/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "./index.css";
import { connect } from "react-redux";
import { useQuery } from "react-query";
import { push } from "react-router-redux";
import NftStart from "metabase/containers/nftPage/components/NftStart";
import NftQa from "metabase/containers/nftPage/components/NftQa";
import NftRoles from "metabase/containers/nftPage/components/NftRoles";
import NftHow from "metabase/containers/nftPage/components/NftHow";
import NftManifesto from "metabase/containers/nftPage/components/NftManifesto";
import NftHolder from "metabase/containers/nftPage/components/NftHolder";
import { loginModalShowAction } from "metabase/redux/control";
import SubmitModal from "metabase/containers/nftPage/components/SubmitModal";
import { addressActivityInfo } from "metabase/new-service";
import { QUERY_OPTIONS } from "metabase/containers/search/shared/config";

const NftPage = props => {
  const { user, setLoginModalShow, onChangeLocation } = props;
  const [showModal, setShowModal] = useState();
  const params = {
    type: "moonMen",
  };
  const { isLoading, data, refetch } = useQuery(
    ["addressActivityInfo", params],
    async () => {
      return addressActivityInfo(params);
    },
    { ...QUERY_OPTIONS, retry: 0, enabled: !!user },
  );

  const successAction = () => {
    refetch();
    setShowModal(false);
  };

  const onClose = () => {
    setShowModal(false);
  };

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
        <NftHow
          user={user}
          setLoginModalShow={setLoginModalShow}
          onChangeLocation={onChangeLocation}
        />
        <NftQa />
        {showModal && (
          <SubmitModal successAction={successAction} onClose={onClose} />
        )}
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  user: state.currentUser,
});

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
  onChangeLocation: push,
};

export default connect(mapStateToProps, mapDispatchToProps)(NftPage);
