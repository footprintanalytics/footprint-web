/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import StudioTitle from "metabase/containers/myStudio/Component/StudioTitle";
import { getOssUrl } from "metabase/lib/image";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";
import "./ComingSoonView.css"
const ComingSoonView = props => {
  const { title } = props;

  return (
    <div className="coming-soon-view">
      {title && (<StudioTitle title={title}/>)}
      <div className="coming-soon-view__inner">
        <AboutImage src={getOssUrl("studio/img-studio-coming-soon.png")} />
        <h4>Coming soon</h4>
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: state.currentUser,
  };
};

export default connect(mapStateToProps)(ComingSoonView);
