/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import { loginModalShowAction } from "metabase/redux/control";
import Button from "metabase/components/Button";
import moment from "moment";
import colors from "metabase/lib/colors";
import "./DashboardCardDisplayInfo.css";
import { isDefi360 } from "metabase/lib/project_info";
import CreatorName from "metabase/components/CreatorName";
import cx from "classnames";

function DashboardCardDisplayInfo({ authorName, date, read, favorite }) {
  return (
    <div className="dashboard-card-display-info footprint-secondary-text2">
      {authorName && <CreatorName creatorName={authorName} />}
      {authorName && <span className="ml1">•</span>}
      {date && (
        <span className={cx({ ml1: !!authorName })}>
          {date ? moment(new Date(date).getTime()).format("YYYY-MM-DD") : " "}
        </span>
      )}
      {read !== undefined && (
        <Button
          small
          borderless
          className="p0 ml2 cursor-default"
          icon="read"
          iconSize={16}
          color={colors["footprint-color-secondary-text2"]}
          iconColor={colors["footprint-color-secondary-text2"]}
          onClick={async e => {
            e.stopPropagation();
          }}
        >
          {`${read}`}
        </Button>
      )}
      {favorite !== undefined && !isDefi360() && (
        <Button
          small
          borderless
          className="p0 ml2 cursor-default"
          icon="star"
          iconSize={16}
          color={colors["footprint-color-secondary-text2"]}
          iconColor={colors["footprint-color-secondary-text2"]}
          onClick={async e => {
            e.stopPropagation();
          }}
        >
          {`${favorite}`}
        </Button>
      )}
    </div>
  );
}

const mapStateToProps = (state, props) => ({
  user: getUser(state, props),
});

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardCardDisplayInfo);
