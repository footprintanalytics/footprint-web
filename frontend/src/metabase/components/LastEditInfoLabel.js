import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { t } from "ttag";
import moment from "moment";

import { getUser } from "metabase/selectors/user";

import { TextButton } from "metabase/components/Button.styled";

function mapStateToProps(state) {
  return {
    user: getUser(state),
  };
}

LastEditInfoLabel.propTypes = {
  item: PropTypes.shape({
    "last-edit-info": PropTypes.shape({
      id: PropTypes.number.isRequired,
      email: PropTypes.string.isRequired,
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
    }).isRequired,
  }),
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

function formatEditorName(firstName, lastName) {
  // const lastNameFirstLetter = lastName.charAt(0);
  // return `${firstName} ${lastNameFirstLetter}.`;
  return `${firstName} ${lastName}.`;
}

function LastEditInfoLabel({ item, user, onClick, className, ...props }) {
  const { first_name, last_name, timestamp } = item["last-edit-info"];
  const time = moment.utc(timestamp).fromNow();

  // const editor =
  //   editorId === user.id ? t`you` : formatEditorName(first_name, last_name);
  const editor = formatEditorName(first_name, last_name);

  return (
    <TextButton
      style={{ marginLeft: 18, cursor: "default" }}
      size="small"
      className={className}
      onClick={onClick}
      data-testid="revision-history-button"
      {...props}
    >
      {t`${editor}`}
      <span
        style={{
          margin: "0 5px",
          transform: "scale(0.5)",
          display: "inline-block",
        }}
      >
        •
      </span>
      {t`${time}`}
    </TextButton>
  );
}

export default connect(mapStateToProps)(LastEditInfoLabel);
