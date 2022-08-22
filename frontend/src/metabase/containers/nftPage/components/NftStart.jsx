/* eslint-disable react/prop-types */
import React from "react";
import { Image, message, Skeleton } from "antd";
import AboutSocial from "metabase/containers/about/components/AboutSocial";

const NftStart = ({
  user,
  setLoginModalShow,
  setShowModal,
  data,
  isLoading,
}) => {
  const isAllowed = data?.isAllowed;
  const userIdIsExist = data?.userIdIsExist;
  const scrollToAnchor = anchorName => {
    if (anchorName) {
      const anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView({ block: "end", behavior: "smooth" });
      }
    }
  };

  const renderButton = () => {
    if (isLoading) {
      return (
        <div className="nft-activity__skeleton">
          <Skeleton active />
        </div>
      );
    }
    if (!user) {
      return (
        <div
          className="nft-activity__btn"
          onClick={() => {
            setLoginModalShow({ show: true, from: "nft-activity" });
          }}
        >
          Sign up
        </div>
      );
    }
    if (user && !userIdIsExist) {
      return (
        <div
          className="nft-activity__btn"
          onClick={() => {
            setShowModal(true);
          }}
        >
          Submit your information to win NFT
        </div>
      );
    }
    if (user && userIdIsExist) {
      return (
        <div
          className="nft-activity__btn"
          onClick={() => {
            scrollToAnchor("nft-activity__how");
          }}
        >
          Earn points to win NFT
        </div>
      );
    }
    if (user && isAllowed) {
      return (
        <div
          className="nft-activity__btn"
          onClick={() => {
            message.info("coming soon");
          }}
        >
          Mint NFT
        </div>
      );
    }
    return <div />;
  };

  return (
    <>
      <div className="nft-activity__start nft-activity__start-bg">
        <div className="nft-activity__wrap">
          <h1>Moon Men</h1>
          <h2>{"Footprint Analytics' NFT is coming! "}</h2>
          <AboutSocial size={20} />
          <span>
            Create your footprint account and <br /> get a chance to mint NFT!{" "}
          </span>
          {renderButton()}
        </div>
        <Image
          placeholder={<Skeleton active />}
          preview={false}
          src={"https://static.footprint.network/img_nft_icon_2022081902.png?2"}
        />
        <div className="nft-activity__start-ball" />
      </div>
    </>
  );
};

export default NftStart;
