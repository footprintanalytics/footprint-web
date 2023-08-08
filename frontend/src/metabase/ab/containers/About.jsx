/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import { getUser, getFgaProject } from "metabase/selectors/user";

const About = props => {
  const { router, location, children, user, projectPath, menu, projectObject } =
    props;
  return (
    <div className="flex flex-column items-center">
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLScxFQC9xKPPFo9dtIaeWu4thPvM5n5ZRCobImjg5wX-pG-1MA/viewform?embedded=true"
        width="600"
        height="800"
        style={{ margin: 20 }}
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
      >
        Loading...
      </iframe>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectPath: props.params.project,
    projectObject: getFgaProject(state),
    menu: props.params.menu,
  };
};

export default connect(mapStateToProps)(About);
