/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
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

const TemplateGallery = props => {
  const { router, location, children, user, currentTab } = props;
  const [templateData, setTemplateData] = useState([]);
  // monitor datas
  const updateData = () => {
    const favorite_template = getGAFavoritedTemplate();
    const data = [];
    template_gallery.map(t => {
      data.push({
        ...t,
        creator: "rogerD",
        favorited:
          favorite_template.findIndex(i => i.No === t.No) === -1 ? false : true,
        avatar:
          "https://static.footprint.network/avatar/19e41ed0-82e2-4489-8a0d-11292806cf91.gif?x-oss-process=image/resize,m_fill,h_120,w_120",
      });
    });
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
          // actions={[
          //   <IconText
          //     icon={item.favorited ? StarFilled : StarOutlined}
          //     text={item.favorited ? "Favorited" : "Favorite"}
          //     click={() => {
          //       message.success(
          //         item.favorited ? "Cancel favorited!" : "Favorited!",
          //       );
          //       saveGAFavoritedTemplate(item, !item.favorited);
          //       updateData();
          //     }}
          //     key="list-vertical-star-o"
          //   />,
          // <IconText
          //   icon={LikeOutlined}
          //   text="156"
          //   key="list-vertical-like-o"
          // />,
          // ]}
          >
            <List.Item.Meta
              // avatar={<Avatar src={item.avatar} />}
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
              // description={`Created by @${item.creator}`}
            />
            {/* <div>content</div> */}
          </List.Item>
        )}
      />
    </div>
  );
};;

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(TemplateGallery);
