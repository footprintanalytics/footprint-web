/* eslint-disable react/prop-types */
import React from "react";
import "./index.css";
import { connect } from "react-redux";
import Personal from "metabase/containers/creator/components/personal";
import List from "metabase/containers/creator/components/personal/list";
import { compose } from "underscore";
import MetaViewportControls from "metabase/dashboard/hoc/MetaViewportControls";
import title, { updateTitle } from "metabase/hoc/Title";

const Index = ({ router, user, params }) => {
  const name = params?.name?.replace("@", "") || "";

  if (name) {
    updateTitle(`@${name}`);
  }

  return (
    <>
      <div className="creator__wrap">
        <Personal router={router} user={user} name={name} />
        <List
          router={router}
          user={user}
          name={name}
          location={router.location}
        />
      </div>
    </>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

export default compose(
  connect(mapStateToProps),
  MetaViewportControls,
  title(),
)(Index);
