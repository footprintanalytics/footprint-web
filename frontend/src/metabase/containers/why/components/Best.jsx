/* eslint-disable react/prop-types */

import React from "react";
import { getOssUrl } from "metabase/lib/image";
import connect from "react-redux/lib/connect/connect";
import { getUser } from "metabase/selectors/user";
import { push } from "react-router-redux";
import TitleDesc from "metabase/containers/why/components/TitleDesc";
import Link from "metabase/components/Link";
import { guestUrl } from "metabase/lib/urls";

const data = [
  {
    type: "logo",
    url: "https://matrixpartners.com/",
    logo: "img-matrix-partners.png",
    name: "Matrix Partners",
  },
  {
    type: "logo",
    url: "https://iosg.vc",
    logo: "img-iosg.png",
    name: "iosg",
  },
  {
    type: "logo",
    url: "https://www.ngc.fund",
    logo: "img-ngc.png",
    name: "ngc",
  },
  {
    type: "logo",
    url: "https://www.youbicapital.com",
    logo: "img-youbi.png",
    name: "youbi",
  },
  {
    type: "logo",
    url: "http://www.7xvc.com",
    logo: "img-sevenx.png",
    name: "sevenx",
  },
  {
    type: "logo",
    url: "https://arkstream.capital/#/Home",
    logo: "img-ark-stream.png",
    name: "ark-stream",
  },
  {
    type: "logo",
    url: "https://www.redpoint.com",
    logo: "img-redpoint.png",
    name: "Redpoint",
  },
  {
    type: "logo",
    url: "https://capitalant.com",
    logo: "img-a-and-t-capital.png",
    name: "A&T Capital",
  },
  {
    type: "logo",
    url: "https://twitter.com/HashGlobal",
    logo: "img-hash-global.png",
    name: "Hash Global",
  },
  {
    type: "logo",
    url: "http://www.lancergrp.com",
    logo: "img-lancer-capital.png",
    name: "Lancer Capital",
  },
  {
    type: "logo",
    url: "https://twitter.com/waterdripfund",
    logo: "img-waterdrip-capital.png",
    name: "Waterdrip Capital",
  },

  {
    type: "logo",
    url: "https://puzzle.ventures",
    logo: "img-puzzle-ventures.png",
    name: "puzzle-ventures",
  },
  {
    type: "logo",
    url: "https://twitter.com/0x_nico0",
    logo: "img-dual-epoch-capital.png",
    name: "Dual Epoch Capital",
  },
  {
    type: "logo",
    url: "https://twitter.com/JarylNgan",
    logo: "img-angel-jary-ngan.png",
    name: "angel-jary-ngan",
  },
  {
    type: "logo",
    url: "https://twitter.com/thejewforu",
    logo: "img-angel-avi-zurlo.png",
    name: "angel-avi-zurlo",
  },
];

const Best = ({ user }) => {
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
    if (item.url) {
      window.open(getLinkUrl(item));
    }
  };

  return (
    <div className="best why-component">
      <TitleDesc title={"Backed by the Best"} />
      <div className="best__container flex justify-center mt4">
        {data.map(item => {
          return (
            <Link
              key={item.name}
              className="best__box"
              to={item.url && getLinkUrl(item)}
              onClick={e => itemOnClick(e, item)}
            >
              <img
                className="best__box-logo"
                src={getOssUrl(item.logo)}
                alt={item.name}
              />
            </Link>
          );
        })}
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Best);
