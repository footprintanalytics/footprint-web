/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Category from "metabase/containers/explore/components/Category";
import "../explore/index.css";
import "./index.css";
import Button from "metabase/components/Button";
import connect from "react-redux/lib/connect/connect";
import { getUser, getUserSubscribeInfo } from "metabase/selectors/user";
import SubscribeModal from "metabase/components/SubscribeModal";
import { loginModalShowAction } from "metabase/redux/control";
import { trackStructEvent } from "metabase/lib/analytics";
import { compose } from "underscore";
import MetaViewportControls from "metabase/dashboard/hoc/MetaViewportControls";

const News = props => {
  const {
    routes,
    location,
    router,
    user,
    setLoginModalShow,
    subscribeInfo,
    children,
  } = props;
  const indexPath = "/news";
  const [modal, setModal] = useState(false);

  const hasPublishPermission = user && user.hasPublishPermission;
  const isOpen = subscribeInfo.subscribeStatus === "enable";

  const categoryList = routes
    .find(item => item.path === indexPath)
    .childRoutes.filter(item => !item.hidden)
    .map(item => ({
      label: item.title,
      path: item.path,
      selected: location.pathname.includes(item.path),
      seoLink: `${indexPath}/${item.path}`,
    }));

  const publishAction = () => {
    router.push("/news/publish");
  };

  const rightPanel = (
    <div className="news__category-right">
      <Button
        className="news__publish"
        iconColor="#7A819B"
        icon="pencil"
        iconSize={16}
        color={"#7A819B"}
        borderless
        onClick={publishAction}
        style={{ visibility: hasPublishPermission ? "" : "hidden" }}
      >
        Publish
      </Button>
      <Button
        className="news__publish"
        iconColor="#7A819B"
        icon="subscribe"
        iconSize={16}
        color={"#7A819B"}
        borderless
        onClick={() => {
          trackStructEvent(`news click Subscription`);
          if (!user) {
            setLoginModalShow({ show: true, from: "subscribe" });
            return;
          }
          setModal(true);
        }}
      >
        {isOpen ? "Subscribed" : "Subscription"}
      </Button>
    </div>
  );

  return (
    <div className="news">
      <Category
        categoryList={categoryList}
        onCategoryClick={item => router.push(`${indexPath}/${item.path}`)}
        rightPanel={rightPanel}
      />
      <div className="news__wrap">
        <div className="news__body">{children}</div>
      </div>
      {modal && (
        <SubscribeModal
          onClose={() => {
            setModal(false);
          }}
        />
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  user: getUser(state),
  subscribeInfo: getUserSubscribeInfo(state),
});

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  MetaViewportControls,
)(News);
