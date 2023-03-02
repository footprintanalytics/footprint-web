/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  Avatar,
  List,
  Image,
  Empty,
  Button,
  Card,
  Tag,
  Divider,
  Tabs,
} from "antd";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import { top_protocols } from "../utils/data";
import "../css/index.css";

const ProjectInfo = props => {
  const { router, project, location } = props;
  const [currentProject, setCurrentProject] = useState();
  useEffect(() => {
    const p = top_protocols.find(i => i.protocol_slug === project);
    setCurrentProject(p ?? null);
  }, []);
  const onTabChange = key => {
    console.log(key);
  };
  return (
    <div className="flex flex-col w-full items-center">
      <Card
        style={{ width: 600, minHeight: 600, marginTop: 50, borderRadius: 10 }}
      >
        {currentProject ? (
          <div className="flex flex-col">
            <div className="flex flex-row">
              <img
                src={
                  "https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                }
                width={80}
                height={80}
                style={{
                  borderRadius: 40,
                  borderWidth: 0.5,
                  borderStyle: "solid",
                  borderColor: "#f8fafb",
                }}
                alt="Project Icon"
              />
              <div className="flex flex-col ml3">
                <div style={{ fontSize: 22, fontWeight: 500 }}>
                  {currentProject.protocol_name}
                </div>
                <div className=" mt1">
                  <Tag>{currentProject.chain}</Tag>
                  <Tag>{currentProject.protocol_type}</Tag>
                </div>
              </div>
            </div>
            {/* <Divider></Divider> */}
            <Tabs
              className=" mt1"
              defaultActiveKey="1"
              onChange={onTabChange}
              items={[
                {
                  label: `NFT Collection Address`,
                  key: "nft",
                  children: `Content of Tab Pane 1`,
                },
                // {
                //   label: `Token Address`,
                //   key: "token",
                //   children: `Content of Tab Pane 2`,
                // },
                // {
                //   label: `Contract Address`,
                //   key: "contract",
                //   children: `Content of Tab Pane 3`,
                // },
              ]}
            />
          </div>
        ) : (
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
              height: 100,
            }}
            description={<span>This project is empty!</span>}
          >
            {/* <Button type="primary">Create Now</Button> */}
          </Empty>
        )}
      </Card>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(ProjectInfo);
