/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import "./MyApi.css";
import Link from "metabase/core/components/Link";
import "./AppStore.css";

const AppStore = props => {
  const data = [
    // {
    //   img: "https://static.footprint.network/img-studio-fga.png?image_process=resize,w_600/crop,h_310/format,jpg",
    //   title: "FGA",
    //   link: "/fga/",
    // },
    {
      img: "https://static.footprint.network/img-studio-fga-public-chain.png?1=1&image_process=resize,w_600/crop,h_310/format,jpg",
      title: "FGA - Public Chain",
      link: "/fga/public-chain",
    },
    {
      img: "https://static.footprint.network/img-studio-fga-project.png?1=1&image_process=resize,w_600/crop,h_310/format,jpg",
      title: "FGA - Project",
      link: "/fga/game",
    },
  ];
  return (
    <>
      <div className="app-store">
          <h2>Recommended For You</h2>
          <ul>
            {data.map(item => {
              return (
                <Link key={item.title} to={item.link}>
                  <li key={item.title}>
                    <img src={item.img} alt={item.title}/>
                    <span className="app-store__box-title">{item.title}</span>
                    {/*<div className="app-store__box-buttons">
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

                    </div>*/}
                  </li>
                </Link>
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
