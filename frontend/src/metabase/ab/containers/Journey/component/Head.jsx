/* eslint-disable react/prop-types */
import React from "react";
import Icon from "metabase/components/Icon";
import "../index.css";
import { getFgaProject } from "metabase/selectors/user";
// eslint-disable-next-line import/order
import { connect } from "react-redux";
import Buttons from "metabase/ab/containers/Journey/component/Buttons";
import Link from "antd/es/typography/Link";
import { getOssUrl } from "metabase/lib/image";

const Head = props => {
  const { title = "Saved Journey", isBack = false, type, projectObject, router, buttons, backLink } = props;
  return (
    <div className="journey-head flex justify-between full-width py1">
      {isBack ? (
        <Link className="flex align-baseline" style={{height: 30}} onClick={() => {
          if (backLink) {
            router?.replace(backLink);
            return ;
          }
          router?.goBack()
        }}>
          <Icon name={"collapse_arrow_left"} size={16} color="white"/>
          <h3 className="ml1">{title}<img className="ml1" alt="" src={getOssUrl("/ab/icon_info.svg")}/></h3>
        </Link>
      ) : (
        <h3 className="ml1">{title}<img className="ml1" alt="" src={getOssUrl("/ab/icon_info.svg")}/></h3>
      )}
      <div className="flex">
        {buttons?.map(type => {
          return (
            <Buttons key={type} type={type} />
          )
        })}
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    projectObject: getFgaProject(state),
  };
};

export default connect(
  mapStateToProps,
  null,
)(Head);
