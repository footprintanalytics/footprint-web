/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { LikeOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import { Avatar, List, message, Space } from "antd";
import { Link } from "react-router";
import { getUser } from "metabase/selectors/user";
import { template_gallery } from "../utils/data";
import {
  getGAFavoritedTemplate,
  saveGAFavoritedTemplate,
} from "../utils/utils";

const MyFavoriteTemplate = props => {
  const { router, location, children, user, currentTab } = props;
  const [templateData, setTemplateData] = useState([]);
  // monitor datas
  const updateData = () => {
    const data = getGAFavoritedTemplate();
    setTemplateData(data);
  };

  useEffect(() => {
    updateData();
  }, [currentTab]);

  const IconText = ({ icon, text, click }) => (
    <Space onClick={click} style={{ cursor: "pointer" }}>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  return (
    <div className="flex flex-column items-center">
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        style={{
          background: "white",
          width: 800,
          margin: 20,
          padding: 20,
          borderRadius: 10,
        }}
        dataSource={templateData}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <IconText
                icon={StarFilled}
                text={"Favorited"}
                click={() => {
                  saveGAFavoritedTemplate(item, false);
                  updateData();
                  message.success("Cancel favorited!");
                }}
                key="list-vertical-star-o"
              />,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.avatar} />}
              title={
                <Link
                  onClick={() => {
                    router.push(item.dashboard_link);
                  }}
                >
                  {index + 1 + ". "}
                  {item.dashboard_name}
                </Link>
              }
              description={`Created by @${item.creator}`}
            />
            {/* <div>content</div> */}
          </List.Item>
        )}
      />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(MyFavoriteTemplate);
