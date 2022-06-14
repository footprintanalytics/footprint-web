/* eslint-disable react/prop-types */

import React from "react";
import { getOssUrl } from "metabase/lib/image";
import connect from "react-redux/lib/connect/connect";
import { getUser } from "metabase/selectors/user";
import { push } from "react-router-redux";
import TitleDesc from "metabase/containers/why/components/TitleDesc";
import Link from "metabase/components/Link";
import { guestUrl } from "metabase/lib/urls";
import { Carousel } from "antd";
import chunk from "lodash/chunk";

const data = [
  {
    type: "logo",
    url: "https://near.org",
    logo: "img-partner-near.png",
    name: "near",
  },
  {
    type: "logo",
    url: "https://www.polygon.com",
    logo: "img-partner-polygon.png",
    name: "polygon",
  },
  {
    type: "logo",
    url: "https://www.avax.network",
    logo: "img-avalanche.png",
    name: "avalanche",
    longLogo: true,
  },
  {
    type: "logo",
    url: "https://www.harmony.one",
    logo: "img-harmony.png",
    name: "harmony",
    longLogo: true,
  },
  {
    id: 294,
    publicUuid: "9f4d30ce-9676-43a9-bf31-2712632b4bf1",
    type: "dashboard",
    imgUrl: "dashboard/294.png",
    logo: "img-partner-curve.png",
    name: "Curve",
  },
  {
    id: 422,
    publicUuid: "55ce6399-c53a-46bd-a2aa-28d7a185016a",
    type: "dashboard",
    imgUrl: "dashboard/422.png",
    logo: "img-partner-insta-app.png",
    name: "Instadapp",
    longLogo: true,
  },
  {
    id: 288,
    publicUuid: "1da2828a-2643-41ab-934b-577513971d89",
    type: "dashboard",
    imgUrl: "dashboard/288.png",
    logo: "img-partner-b-protocol.png",
    name: "B.Protocol",
    longLogo: true,
  },
  {
    id: 456,
    publicUuid: "a4a557da-a4c4-4f2a-b57d-669eff4b3831",
    type: "dashboard",
    imgUrl: "dashboard/456.png",
    logo: "img-partner-badger.png",
    name: "Badger",
  },
  {
    id: 291,
    publicUuid: "a76d1c0a-781f-45ca-804f-534f20282ddd",
    type: "dashboard",
    imgUrl: "dashboard/291.png",
    logo: "img-partner-dfx.png",
    name: "DFX",
  },
  {
    id: 468,
    publicUuid: "d4b90745-56cb-474a-87cf-76aa2c711306",
    type: "dashboard",
    imgUrl: "dashboard/468.png",
    logo: "img-partner-definer.png",
    name: "DeFiner",
  },
  {
    type: "logo",
    url: "https://www.cointofu.com",
    logo: "img-partner-coinTofu.png",
    name: "CoinTofu",
  },
  {
    type: "logo",
    url: "https://cryptoslate.com",
    logo: "img-partner-cryptoslate.png",
    name: "CryptoSlate",
    longLogo: true,
  },
  {
    type: "logo",
    url: "https://www.youtube.com/channel/UC42E-54LCmsclJJ2-LZ7RdA",
    logo: "img-partner-zinstitute.png",
    name: "The Z Institute",
    longLogo: true,
  },
  {
    type: "logo",
    url: "https://www.ftftx.com",
    logo: "img-partner-ftftx.png",
    name: "FTFTX",
  },
  {
    type: "logo",
    url: "https://thejourneywest.io",
    logo: "img-partner-joiurney-west.png",
    name: "The Journey West",
  },
  {
    type: "logo",
    url: "https://www.ethalend.org",
    logo: "img-partner-ethalend.png",
    name: "ETHA",
  },
  {
    type: "logo",
    url: "https://www.youtube.com/channel/UCRerMNjpRubIDVqhhHqyCeA",
    logo: "img-partner-superc.png",
    name: "SuperC",
  },
  {
    type: "logo",
    url: "https://blockchain101.com",
    logo: "img-partner-blockchain-nyc.png",
    name: "Blockchain NYC",
  },
  {
    type: "logo",
    url: "https://d-core.net",
    logo: "img-partner-d-core.png",
    name: "D-Core",
  },
  {
    type: "logo",
    url: "https://gmx.io",
    logo: "img-partner-gmx.png",
    name: "GMX",
  },
  {
    type: "logo",
    url: "https://gravityfinance.io/swap",
    logo: "img-partner-gravity.png",
    name: "Gravity Finance",
  },
  {
    type: "logo",
    url: " https://mstable.org",
    logo: "img-partner-mstable.png",
    name: "mSTABLE",
  },
  {
    type: "logo",
    url: "https://zks.org",
    logo: "img-partner-zkspace.png",
    name: "zkspace",
  },
  {
    type: "logo",
    url: "https://bestdas.com",
    logo: "img-bit.png",
    name: "bit",
  },
  {
    type: "logo",
    url: "https://twitter.com/doubletop_io",
    logo: "img-double-top.png",
    name: "double-top",
    longLogo: true,
  },
];

const carouselData = chunk(data, 15);

const Partners = ({ user }) => {
  const getLinkUrl = item => {
    if (item.url) {
      return item.url;
    }
    const type = item.type === "dashboard" ? "dashboard" : "chart";
    return !user || (user.id !== item.creatorId && !user.is_superuser)
      ? guestUrl(item)
      : `/${type}/${item.id}`;
  };

  const itemOnClick = (e, item) => {
    e.preventDefault();
    window.open(getLinkUrl(item));
  };

  const renderData = data => {
    return data.map(item => {
      return (
        <Link
          key={item.name}
          className="partners__box"
          to={getLinkUrl(item)}
          onClick={e => itemOnClick(e, item)}
        >
          <img
            className={
              item.longLogo ? "partners__box-long-logo" : "partners__box-logo"
            }
            src={getOssUrl(item.logo)}
            alt={item.name}
            draggable="false"
          />
        </Link>
      );
    });
  };
  return (
    <div className="partners why-component">
      <TitleDesc title={"Partners"} />
      <Carousel className="partner__carousel" autoplay>
        {carouselData.map((item, index) => {
          return (
            <div key={index}>
              <div className="partners__container flex justify-center mt4">
                {renderData(item)}
              </div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state, props),
  };
};

const mapDispatchToProps = {
  onChangeLocation: push,
};

export default connect(mapStateToProps, mapDispatchToProps)(Partners);
