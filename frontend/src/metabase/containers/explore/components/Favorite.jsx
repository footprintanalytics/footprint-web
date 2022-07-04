/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import { loginModalShowAction } from "metabase/redux/control";
import Button from "metabase/components/Button";
import { message } from "antd";
import colors from "metabase/lib/colors";
import cx from "classnames";
import "./Favorite.css";
import {
  deleteCardFavorite,
  deleteCardPublicFavorite,
  deleteDashboardFavorite,
  deleteDashboardPublicFavorite,
  postCardFavorite,
  postCardPublicFavorite,
  postDashboardFavorite,
  postDashboardPublicFavorite,
} from "metabase/new-service";
import { debounce } from "lodash";
import { trackStructEvent } from "../../../lib/analytics";
import { deviceInfo } from "metabase-lib/lib/Device";

function Favorite({
  className,
  uuid,
  id,
  type,
  isLike,
  like,
  favoriteClickSuccess,
  user,
  setLoginModalShow,
  onlyIcon,
  borderless,
  iconColor,
  onlyViewByButton,
  hideNumber,
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorite, setFavorite] = useState(0);

  useEffect(() => {
    setIsFavorite(isLike);
  }, [isLike]);

  useEffect(() => {
    setFavorite(like);
  }, [like]);

  async function likeApi(isFavorite) {
    const hide = message.loading("Loading...", 0);
    if (isFavorite) {
      if (type === "dashboard") {
        if (uuid) {
          await deleteDashboardPublicFavorite({ uuid });
        } else {
          await deleteDashboardFavorite({ id });
        }
      } else {
        if (uuid) {
          await deleteCardPublicFavorite({ uuid });
        } else {
          await deleteCardFavorite({ id });
        }
      }
    } else {
      if (type === "dashboard") {
        if (uuid) {
          await postDashboardPublicFavorite({ uuid });
        } else {
          await postDashboardFavorite({ id });
        }
      } else {
        if (uuid) {
          await postCardPublicFavorite({ uuid });
        } else {
          if (id) await postCardFavorite({ id });
        }
      }
    }
    hide();
    return !isFavorite;
  }

  const debounceEventHandler = (...args) => {
    const debounced = debounce(...args);
    return e => {
      e.stopPropagation();
      return debounced(e);
    };
  };

  const onButtonClick = async () => {
    if (onlyViewByButton) {
      return;
    }
    trackStructEvent(`click Favorite`);
    if (user) {
      const nowFavorite = await likeApi(isFavorite);
      setIsFavorite(nowFavorite);
      if (favorite !== -1) {
        setFavorite(nowFavorite ? favorite + 1 : favorite - 1);
      }

      favoriteClickSuccess &&
        favoriteClickSuccess({ id, type, favorite: nowFavorite });
    } else {
      setLoginModalShow({
        show: true,
        from: "preview_dashboard_card_duplicate",
      });
    }
  };

  const getFavoriteText = () => {
    if (hideNumber) return "Favorites";
    if (favorite !== -1) return `${favorite}`;
    if (isFavorite) return "Added";
    return deviceInfo().isMobile ? "" : "Add to favorite list";
  };

  return (
    <Button
      borderless={borderless}
      onlyIcon={onlyIcon}
      small
      className={cx(
        className,
        !borderless && (isFavorite ? "favorite-active" : "favorite-normal"),
      )}
      icon="star"
      iconSize={16}
      color={"#7A819B"}
      iconColor={iconColor ? iconColor : isFavorite ? "#FFCC00" : "#7A819B"}
      onClick={debounceEventHandler(onButtonClick, 100)}
    >
      {getFavoriteText()}
    </Button>
  );
}

const mapStateToProps = (state, props) => ({
  user: getUser(state, props),
});

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Favorite);
