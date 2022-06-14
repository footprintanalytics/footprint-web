/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import "./index.css";
import FeaturesSide from "metabase/containers/features/components/FeaturesSide";
import Home from "metabase/containers/home/index";
import { menuDetailList } from "metabase/new-service";
import { getFeaturesSideHide } from "metabase/selectors/control";
import DashboardArea from "metabase/containers/features/components/DashboardArea";
import { loginModalShowAction } from "metabase/redux/control";

const Index = props => {
  const {
    hideSide,
    menu,
    subMenu,
    location,
    children,
    user,
    setLoginModalShow,
  } = props;
  const [mode, setMode] = useState(""); //home,dashboard
  const [item, setItem] = useState();
  const [hasShowLoginAuto, setHasShowLoginAuto] = useState(false);

  const handleScroll = event => {
    if (!event.srcElement.scrollTop) {
      return undefined;
    }
    const scrollTop =
      (event.srcElement ? event.srcElement.scrollTop : false) ||
      window.pageYOffset ||
      (event.srcElement ? event.srcElement.body.scrollTop : 0);
    const bodyHeight = document.documentElement.scrollHeight;

    if (scrollTop >= bodyHeight * 1) {
      setHasShowLoginAuto(true);
      window.removeEventListener("scroll", handleScroll, true);
      setLoginModalShow({
        show: true,
        from: "AutoPopupLogin",
      });
    }
  };

  useEffect(() => {
    if (mode && mode !== "home" && !user && !hasShowLoginAuto) {
      window.addEventListener("scroll", handleScroll, true);
    }
    return () => {
      if (!user) {
        window.removeEventListener("scroll", handleScroll, true);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const loadData = async ({ menu, subMenu }) => {
    if (menu === "Featured") {
      setMode("home");
      return;
    }

    setMode("dashboard");
    if (menu && subMenu) {
      getViewData({ menu, subMenu });
    } else {
      setItem(undefined);
    }
  };

  const getViewData = async ({ menu, subMenu }) => {
    const { data } = await menuDetailList({
      menu,
      subMenu,
    });
    if (data.length === 0) {
      setItem(undefined);
      return;
    }
    setItem(data[0]);
  };

  return (
    <div className="Features bg-gray flex">
      <div className="Features-side" style={{ width: hideSide ? 0 : 280 }}>
        <FeaturesSide
          defaultMenu={menu}
          defaultSubMenu={subMenu}
          loadData={loadData}
          type="topic"
          hasSeeMore
          hasSearch
        />
      </div>
      <div
        className="Features-main"
        style={{
          overflow: mode === "dashboard" ? "hidden" : "auto",
        }}
      >
        {mode === "home" && <Home location={location} />}
        {mode === "dashboard" && (
          <DashboardArea location={location} item={item} />
        )}
      </div>
      {children}
    </div>
  );
};

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
};

const mapStateToProps = (state, props) => {
  return {
    menu: props.params.menu,
    subMenu: props.params.subMenu,
    hideSide: getFeaturesSideHide(state, props),
    user: state.currentUser,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
