/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { LikeOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import { Avatar, List, message, Space, Card, Image } from "antd";
import { Link } from "react-router";
import { getUser } from "metabase/selectors/user";
import { template_gallery } from "../utils/data";
import {
  getGAFavoritedTemplate,
  saveGAFavoritedTemplate,
} from "../utils/utils";
const { Meta } = Card;
const TemplateGallery = props => {
  const { router, location, children, user, currentTab } = props;
  const [templateData, setTemplateData] = useState([]);
  // monitor datas
  const updateData = () => {
    setTemplateData(template_gallery);
  };
  useEffect(() => {
    updateData();
  }, [currentTab]);

  return (
    <div className="flex flex-column items-center">
      <div className="flex flex-column" style={{ width: "80%" }}>
        {templateData.map(i => {
          return (
            <div key={i.category}>
              <h2 className=" mt3">{i.category}</h2>
              <div>{i.desc}</div>
              <div className=" mt1">
                <List
                  grid={{ gutter: 10, column: 4 }}
                  dataSource={i.items}
                  renderItem={item => (
                    <List.Item>
                      <Link href={item.dashboardLink}>
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
                                minHeight: 150,
                              }}
                              alt={item.dashboardName}
                              src={`https://statichk.footprint.network/dashboard/${item.id}.png?image_process=resize,w_600/crop,h_310/format,jpg`}
                            />
                          }
                        >
                          <Meta description={item.dashboardName} />
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

export default connect(mapStateToProps)(TemplateGallery);
