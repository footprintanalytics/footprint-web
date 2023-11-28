/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { loginModalShowAction } from "metabase/redux/control";

const Head = ({ data, user, setLoginModalShow, onCancelSubscription }) => {

  return (
    <div className="batch-download-head">
      <ul>
        {data?.map(item => {
          return (
            <li key={item.title} style={{ flex: item.flex || 1}}>
              {item.title}
              <div className="batch-download-head__sub-item">
                {item.subData?.map(subItem => {
                  return (
                    <div key={subItem.title} className="batch-download-head__sub-item-li">
                      {subItem.title}
                      <span className="batch-download-head__desc">{subItem.desc}</span>
                    </div>
                  )
                })}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Head);
