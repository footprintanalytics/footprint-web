/* eslint-disable react/prop-types */
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Skeleton } from "antd";
import PreviewDashboardCard from "metabase/components/PreviewDashboardCard";
import ShareModal from "metabase/containers/home/components/ShareModal";
// import CollectionEmptyState from "metabase/components/CollectionEmptyState";
// import { Box } from "grid-styled";
import Icon from "metabase/components/Icon";
import {
  createModalShowAction,
  loginModalShowAction,
} from "metabase/redux/control";
import connect from "react-redux/lib/connect/connect";
import { getUser } from "metabase/home/selectors";
import Modal from "metabase/components/Modal";
import CreateActionModal from "metabase/components/CreateActionModal";
import { isPublicPath } from "metabase/lib/urls";
import { isDefi360 } from "metabase/lib/project_info";

function List({
  exploreList,
  exploreTotal,
  type,
  loadMore,
  onAfterChangePublicUuid,
  favoriteClickSuccess,
  archiveSuccess,
  createPanel,
  user,
  setLoginModalShow,
  setCreateModalShow,
  location,
  showArchiveButton,
}) {
  const [shareModalResource, setShareModalResource] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [hasMore, setHasMore] = useState(exploreList.length < exploreTotal);

  if (exploreTotal === undefined) {
    return <Skeleton style={{ maxWidth: "1350px", margin: "0 auto" }} active />;
  }

  const renderCreatePanel = () => {
    return (
      <div
        key={"createPanel"}
        className="explore__list-item"
        style={{ cursor: "pointer" }}
      >
        <div
          className="preview-dashboard-card footprint-p-s"
          onClick={() => {
            if (isPublicPath()) {
              setShowCreateModal(true);
              return;
            }
            if (user) {
              setCreateModalShow({ show: true });
            } else {
              setLoginModalShow({ show: true, from: "explore_create" });
            }
          }}
        >
          <div className="flex align-center justify-center full-height flex-column explore__list-create-border">
            <Icon name="explore_add" size={60} color={"#3334B2"} />
            <span className="explore__list-create-title footprint-title2">
              Create My Dashboard/Chart
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      {/* {exploreTotal > 0 ? ( */}
      <InfiniteScroll
        dataLength={exploreList.length}
        next={loadMore}
        hasMore={hasMore}
        className="explore__list"
        pullDownToRefreshThreshold={300}
        onScroll={() => {
          if (isDefi360()) {
            setHasMore(true);
          } else {
            const isActive = location.pathname === window.location.pathname;
            const canLoadMore = isActive && exploreList.length < exploreTotal;
            if (canLoadMore !== hasMore) {
              setHasMore(canLoadMore);
            }
          }
        }}
      >
        {createPanel && renderCreatePanel()}
        {exploreList.map(item => (
          <div
            key={item.publicUuid + item.id + item.type}
            className="explore__list-item"
          >
            <PreviewDashboardCard
              item={item}
              showArchiveButton={showArchiveButton}
              favoriteClickSuccess={favoriteClickSuccess}
              archiveSuccess={archiveSuccess}
              shareAction={entity => {
                setShareModalResource({
                  open: true,
                  public_uuid: entity.publicUuid,
                  type: entity.type,
                  name: entity.name,
                  id: entity.id,
                  uniqueName: entity.uniqueName,
                  creator: entity.creator,
                });
              }}
            />
          </div>
        ))}
      </InfiniteScroll>
      {/* ) : (
        <Box mt="120px">
          <CollectionEmptyState
            showCreateButton={true}
            setCreateModalShow={setCreateModalShow}
          />
        </Box>
      )} */}
      <ShareModal
        resource={shareModalResource}
        onAfterChangePublicUuid={param => {
          onAfterChangePublicUuid && onAfterChangePublicUuid(param);
          if (type === "explore") {
            setShareModalResource({});
          }
        }}
        onClose={() => setShareModalResource({})}
      />

      {showCreateModal && (
        <Modal
          className="w-auto"
          ModalClass="z-index-top"
          onClose={() => setShowCreateModal(false)}
        >
          <CreateActionModal onClose={() => setShowCreateModal(false)} />
        </Modal>
      )}
    </React.Fragment>
  );
}

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state, props),
  };
};

const mapDispatchToProps = {
  setCreateModalShow: createModalShowAction,
  setLoginModalShow: loginModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
