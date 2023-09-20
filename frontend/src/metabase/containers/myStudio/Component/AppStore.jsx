/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import DeveloperApp from "metabase/account/developer/containers/DeveloperApp/DeveloperApp";
import { Button } from "antd";
import "./MyApi.css";
import Statistics from "metabase/containers/dataApi/statistics";
import StudioTitle from "metabase/containers/myStudio/Component/StudioTitle";
import Link from "metabase/core/components/Link";
import "./AppStore.css";

const AppStore = props => {
  const { location, showUsage, showApiKey } = props;
  const data = [
    {
      img: "https://static.footprint.network/img-studio-fga.png?image_process=resize,w_600/crop,h_310/format,jpg",
      title: "FGA",
      link: "/fga",
    },
  ];
  return (
    <>
      <div className="app-store">
        <ul>
          {data.map(item => {
            return (
              <li key={item.title}>
                <img src={item.img} />
                <span className="app-store__box-title">{item.title}</span>
                <div className="app-store__box-buttons">
                  <Link to={item.link}>
                    <Button
                      type="text"
                    >
                      Add my app
                    </Button>
                    <Button
                      type="text"
                    >
                      Preview
                    </Button>
                    <Button
                      type="text"
                    >
                      Share
                    </Button>
                  </Link>

                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: state.currentUser,
  };
};

export default connect(mapStateToProps)(AppStore);
