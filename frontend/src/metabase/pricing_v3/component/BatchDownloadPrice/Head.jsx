/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { loginModalShowAction } from "metabase/redux/control";
import { Tooltip } from "antd";
import Icon from "metabase/components/Icon";

const Head = ({ data, user, setLoginModalShow, onCancelSubscription }) => {

  return (
    <div className="batch-download-head">
      <ul>
        {data?.map(item => {
          return (
            <li key={item.title} style={{ flex: item.flex || 1}}>
              <div className="flex align-center">
                {item.title}
                {item.tooltip && (
                  <Tooltip
                    title={item.tooltip}
                  >
                    <Icon className="ml1" name={"info"} />
                  </Tooltip>
                )}
              </div>

              <div className="batch-download-head__sub-item">
                {item.subData?.map(subItem => {
                  return (
                    <div key={subItem.title} className="batch-download-head__sub-item-li">
                      <div className="flex align-center" style={{ justifyContent: subItem.justifyContent || "center" }}>
                        {subItem.title}
                        {subItem.tooltip && (
                          <Tooltip
                            title={item.tooltip}
                          >
                            <Icon className="ml1" name={"info"} />
                          </Tooltip>
                        )}
                      </div>
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
