/* eslint-disable react/prop-types */
import React from "react";
import "./index.css";
import { connect } from "react-redux";
import Filter from "metabase/containers/protocols/components/Filter";
import List from "metabase/containers/protocols/components/Protocols/List";

const Index = ({ router, user }) => {
  return (
    <>
      <div className="protocols__wrap">
        <div className="bg-white">
          <div className="protocols__header">
            <div className="protocols__cell">
              <h2>Discover Protocols on Footprint</h2>
            </div>
            <Filter user={user} router={router} />
          </div>
        </div>
        <div className="protocols__middle">
          <List user={user} router={router} />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

export default connect(mapStateToProps)(Index);
