/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import "./ResourceBox.css";
import { getOssUrl } from "metabase/lib/image";
import { push, replace } from "react-router-redux";
import Link from "metabase/core/components/Link";

const ResourceBox = props => {
  const { item, type, classify, replace, menu, subMenu, location } = props;
  console.log("ResourceBox", item);
  const resources = item && item.resources;
  return (
    <div className="ResourceBox">
      <div className="ResourceBox__container">
        <ul>
          {resources?.map((item, index) => {
            return (
              <li key={index}>
                <Link
                  to={`/${type}/${classify}/${menu}/${subMenu}/${item.value}`}
                  onClick={() => {
                    replace(`/${type}/${classify}/${menu}/${subMenu}/${item.value}`);
                  }}
                >
                  <img src={getOssUrl(item.image)} alt={item.label} />
                  <div className="ResourceBox__divide" />
                  <div className="ResourceBox__text-layout">
                    <span>{item.label}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};


const mapDispatchToProps = {
  replace,
  onChangeLocation: push,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResourceBox);
