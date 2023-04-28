/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { List, Card, Image } from "antd";
import { Link } from "react-router";
import { getUser } from "metabase/selectors/user";
import { template_gallery } from "../utils/data";

const { Meta } = Card;
const CustomAnalysis = props => {
  const { router, location, children, user, project } = props;

  return (
    <div className="flex flex-column items-center">
      <div className="flex flex-column" style={{ width: "80%" }}>
        {template_gallery(project).map(i => {
          return (
            <div key={i.category}>
              <h2 className=" mt3">{i.category}</h2>
              <div style={{ color: "#ffffff80" }}>{i.desc}</div>
              <div className=" mt1">
                <List
                  grid={{
                    gutter: 10,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 2,
                    xl: 3,
                    xxl: 4,
                  }}
                  dataSource={i.items}
                  renderItem={item => (
                    <List.Item>
                      <Link to={item.dashboardLink}>
                        <Card
                          hoverable
                          style={{
                            borderRadius: 5,
                            padding: 5,
                            borderWidth: 1,
                            borderStyle: "solid",
                          }}
                          cover={
                            <Image
                              preview={false}
                              fallback="https://statichk.footprint.network/dashboard/6863.png?image_process=resize,w_600/crop,h_310/format,jpg"
                              style={{
                                background: "white",
                                width: "100%",
                                height: 160,
                              }}
                              alt={item.dashboardName}
                              src={`https://statichk.footprint.network/dashboard/${item.id}.png?image_process=resize,w_600/crop,h_310/format,jpg`}
                            />
                          }
                        >
                          <Meta title={item.dashboardName} />
                        </Card>
                      </Link>
                    </List.Item>
                  )}
                />
                {/* {i.items.map(j => {
                  return <div key={j.dashboardName}>{j.dashboardName}</div>;
                })} */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(CustomAnalysis);
