/* eslint-disable react/prop-types */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { Flex } from "grid-styled";
import HomeBanner from "./components/HomeBanner";
import ShareModal from "metabase/containers/home/components/ShareModal";
import UserQuestionnaireModal from "metabase/components/UserQuestionnaireModal";
import {
  getHome,
  getUserInterests,
  postUserInterests,
} from "metabase/new-service";
import "./index.css";
import "../news/index.css";
import { Skeleton } from "antd";
import HomeFooter from "metabase/containers/home/components/HomeFooter";
import HomeContent from "metabase/containers/home/components/HomeContent";
import {
  getActivityZkspaceRegisterSuccess,
  isRegisterActivityChannel,
  zkspaceDate,
} from "metabase/lib/register-activity";
import ActivityZkspaceSignupSuccessModal from "metabase/components/ActivityZkspaceSignupSuccessModal";
import { getChannel } from "metabase/selectors/app";
import {
  createModalShowAction,
  loginModalShowAction,
} from "metabase/redux/control";
import ActivityZkspaceFirstModal from "metabase/components/ActivityZkspaceFirstModal";
import * as Urls from "metabase/lib/urls";

const Home = ({
  children,
  user,
  channel,
  setLoginModalShow,
  onChangeLocation,
}) => {
  const [shareModalResource, setShareModalResource] = useState({});
  const [questionnaireModal, setQuestionnaireModal] = useState(false);
  const [showZkspaceModal, setShowZkspaceModal] = useState(false);
  const [showZkspaceSuccessModal, setShowZkspaceSuccessModal] = useState(false);
  const [recommends, setRecommends] = useState([]);
  // const [news, setNews] = useState([]);
  const [mediaInfos, setMediaInfos] = useState([]);
  const userId = user && user.id;
  const email = user && user.email;

  useEffect(() => {
    if (zkspaceDate() && !user && isRegisterActivityChannel(channel)) {
      setShowZkspaceModal(true);
    }

    if (zkspaceDate() && userId && getActivityZkspaceRegisterSuccess(email)) {
      setShowZkspaceSuccessModal(true);
    }
    const fetchData = async () => {
      const data = await getHome();
      setRecommends(data.recommends);
      // setNews(data.news);
      setMediaInfos(data.mediaInfos);
    };
    const checkInterest = async () => {
      const data = await getUserInterests();
      if (!data.identity) {
        setTimeout(() => {
          setQuestionnaireModal(true);
        }, 500);
      }
    };
    fetchData();
    if (userId) {
      checkInterest();
    }
  }, [channel, email, user, userId]);

  const onAfterChangePublicUuid = async ({ newUuid, id, type }) => {
    if (!newUuid) {
      setRecommends(
        recommends.map(param => {
          return {
            ...param,
            items: param.items.filter(
              item => item.id !== id || item.type !== type,
            ),
          };
        }),
      );
      setShareModalResource({});
    }
  };

  return (
    <div className="w-full">
      <HomeBanner />
      <Flex flexDirection="column">
        {recommends.length ? (
          <HomeContent
            recommends={recommends}
            mediaInfos={mediaInfos}
            setShareModalResource={setShareModalResource}
          />
        ) : (
          <div
            className="home-dashboard-container"
            style={{ minHeight: 800, paddingTop: 30 }}
          >
            <Skeleton active />
          </div>
        )}
        <HomeFooter />
      </Flex>

      <ShareModal
        resource={shareModalResource}
        onAfterChangePublicUuid={onAfterChangePublicUuid}
        onClose={() => {
          setShareModalResource({});
        }}
      />
      {showZkspaceModal && (
        <ActivityZkspaceFirstModal
          onClose={() => {
            setShowZkspaceModal(false);
          }}
          onClick={() => {
            setLoginModalShow({
              show: true,
              from: "zkspace-first-modal click login",
            });
            setShowZkspaceModal(false);
          }}
        />
      )}
      {showZkspaceSuccessModal && (
        <ActivityZkspaceSignupSuccessModal
          onClose={() => {
            setShowZkspaceSuccessModal(false);
          }}
          onClick={() => {
            onChangeLocation(Urls.newQuestion());
            setShowZkspaceSuccessModal(false);
          }}
        />
      )}

      <UserQuestionnaireModal
        visible={
          questionnaireModal && !showZkspaceModal && !showZkspaceSuccessModal
        }
        onSubmit={async ({ identity, interests }) => {
          await postUserInterests({ identity, interests });
          setQuestionnaireModal(false);
        }}
        onClose={() => {
          setQuestionnaireModal(false);
        }}
      />
      {children}
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: state.currentUser,
    channel: getChannel(state),
  };
};

const mapDispatchToProps = {
  onChangeLocation: push,
  setLoginModalShow: loginModalShowAction,
  setCreateModalShow: createModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
