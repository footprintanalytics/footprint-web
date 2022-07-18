/* eslint-disable curly */
/* eslint-disable react/prop-types */
import { getOssUrl } from "metabase/lib/image";
import React, { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import WrapLink from "./WrapLink";
import LoginModal from "metabase/auth/containers/LoginModal";
import { trackStructEvent } from "metabase/lib/analytics";

const AboutHeader = ({ router, location, user }) => {
  const [loginModal, setLoginModal] = useState({
    show: false,
    signTabState: "signIn",
  });
  const [search, setSearch] = useState();
  const list = [
    { title: "Dashboard", url: "/dashboards" },
    { title: "Data", url: "/dashboards" },
    { title: "Academy", url: "/academy" },
    { title: "Docs", url: "https://docs.footprint.network/" },
    { title: "Pricing", url: "/pricing" },
    { title: "My Profile", url: `/@${user.name}` },
  ];

  return (
    <header className="About__container About__header">
      <div className="About__header-left">
        <WrapLink url="/about">
          <img
            className="About__header-logo"
            src={getOssUrl("20220602160732.png")}
            alt="Footprint Analytics"
          />
        </WrapLink>
        <ul className="About__header-nav">
          {list.map(item => (
            <li key={item.title}>
              <WrapLink
                url={item.url}
                onClick={() => {
                  trackStructEvent("About", `Nav ${item.title}`);
                }}
              >
                {item.title}
              </WrapLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="About__header-right">
        <div className="About__search">
          <SearchOutlined className="About__search-icon" />
          <input
            className="About__search-input"
            placeholder="Search"
            defaultValue={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key !== "Enter" || !search) return;
              router.push(`/search?q=${search}`);
              trackStructEvent("About", `Search ${search}`);
            }}
          />
        </div>
        {user ? (
          <div className="About__btn About__btn--blue">
            <WrapLink
              url="/dashboards"
              onClick={() => trackStructEvent("About", "Open App")}
            >
              Open App
            </WrapLink>
          </div>
        ) : (
          <>
            <div
              className="About__btn About__btn--gray"
              onClick={() => {
                setLoginModal({ show: true, signTabState: "signIn" });
                trackStructEvent("About", "Login");
              }}
            >
              Login
            </div>
            <div
              className="About__btn About__btn--blue"
              onClick={() => {
                setLoginModal({ show: true, signTabState: "signUp" });
                trackStructEvent("About", "Sign Up");
              }}
            >
              Sign Up
            </div>
          </>
        )}
      </div>
      <LoginModal
        signTabState={loginModal.signTabState}
        isOpen={loginModal.show}
        onClose={() => setLoginModal({ show: false })}
        location={location}
        fromNav={true}
      />
    </header>
  );
};

export default AboutHeader;
