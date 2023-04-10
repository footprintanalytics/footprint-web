/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Button, Card, Breadcrumb, List, Typography } from "antd";
import { connect } from "react-redux";
import { getUser, getFgaProject } from "metabase/selectors/user";
import PublicDashboard from "metabase/public/containers/PublicDashboard";
const { Text } = Typography;

const UserTemplate = props => {
  const { router, location, children, user, projectPath, menu, projectObject } =
    props;
  const [template, setTemplate] = useState();
  useEffect(() => {
    if (location.query.tag) {
      setTemplate(location.query.tag);
    }
  }, [location.query.tag]);

  const templates = [
    {
      name: "Token Airdrop",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/airdrop2.svg",
      key: "token-airdrop",
    },
    {
      name: "NFT Collector",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/nft_hunter.svg",
      key: "nft-collector",
    },
    {
      name: "Active Gamer",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/activity_gamer.svg",
      key: "active-gamer",
    },
    {
      name: "Token Whale",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/whale_tracking.svg",
      key: "token-whale",
    },
    {
      name: "Customer Filter",
      key: "CustomerFilter",
      hiden: true,
    },
  ];
  return (
    <>
      {template ? (
        <PublicDashboard
          params={{ uuid: "b46fc872-c97d-4300-a83e-45fa61760ad2" }}
          hideTitle={true}
          location={location}
          // project={{
          //   ...projectObject,
          //   template: template === "CustomerFilter" ? null : template,
          // }}
          header={
            <Breadcrumb
              className=" pl1 pt2"
              items={[
                {
                  title: (
                    <a
                      onClick={() => {
                        setTemplate(null);
                        router.replace({
                          pathname: location.pathname,
                        });
                      }}
                    >
                      Potential Users
                    </a>
                  ),
                },
                {
                  title: `${
                    templates.find(item => item.key === template)?.name
                  }`,
                },
              ]}
            />
          }
          isFullscreen={false}
          // className="ml-250 mt-60 "
          key={template}
          hideFooter
        />
      ) : (
        <div
          className="flex flex-column items-center"
          style={{ marginBottom: 100 }}
        >
          <div
            className="flex flex-column"
            style={{ width: "90%", maxWidth: 1000, minWidth: 600 }}
          >
            <div className=" mt-50 flex flex-row w-full items-center justify-between align-center">
              <h2>Which type of user are you looking for?</h2>
              <Button
                type="link"
                onClick={() => {
                  setTemplate("CustomerFilter");
                }}
              >
                {"Customer Filter >"}
              </Button>
            </div>
            <div className="flex flex-row items-center mt4 w-full">
              <List
                className="w-full"
                grid={{
                  gutter: 10,
                  xs: 2,
                  sm: 2,
                  md: 2,
                  lg: 4,
                  xl: 4,
                  xxl: 4,
                }}
                dataSource={templates}
                renderItem={item => (
                  <List.Item
                    onClick={() => {
                      // setIsModalOpen(false);
                      // setTemplate(item.key);
                      router.push({
                        pathname: location.pathname,
                        query: { tag: item.key },
                      });
                    }}
                  >
                    {!item.hiden && (
                      <Card hoverable style={{ width: "100%" }}>
                        <div
                          className=" flex flex-column items-center"
                          style={{}}
                        >
                          <img src={item?.icon} className="ga-big-icon"></img>
                          <Text ellipsis={true}>{item?.name}</Text>
                        </div>
                      </Card>
                    )}
                  </List.Item>
                )}
              />
            </div>

            <h2 className="m mt4 w-full text-centered">How it work?</h2>
            <div className="mt3 flex flex-row w-full items-center justify-between">
              <img
                src="https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220225181036.png"
                style={{ width: "40%" }}
              ></img>
              <div className="flex flex-column p2" style={{ width: "50%" }}>
                <h3>
                  Associating millions of data - From addresses to social media
                </h3>
                <Text className="mt1">
                  {
                    "Footprint GA can connect to the world's largest blockchain projects and synchronize with Web2 data, to achieve data mining and algorithm learning automatically. You can find information about millions of addresses, and contact social media information for automatic classification, filtering, and tagging."
                  }
                </Text>
              </div>
            </div>
            <div className="mt2 flex flex-row w-full items-center justify-between">
              <div className="flex flex-column p2" style={{ width: "50%" }}>
                <h3>Intelligent data analytics - AI and Machine Learning</h3>
                <Text className="mt1">
                  {
                    "Footprint GA can deliver intelligent data analytics and operation through utilizing AI and Machine Learning technology, which can boost the efficiency of data analysis and save your time and resources, enabling you to have more focus on the things that matter."
                  }
                </Text>
              </div>
              <img
                src="https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220225185345.png"
                style={{ width: "40%" }}
              ></img>
            </div>
            <div className="mt2 flex flex-row w-full items-center justify-between">
              <img
                src="https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220225210539.png"
                style={{ width: "40%" }}
              ></img>
              <div className="flex flex-column p2" style={{ width: "50%" }}>
                <h3>
                  Multi-dimensional analysis - From addresses to industries
                </h3>
                <Text className="mt1">
                  {
                    "Footprint GA provides various dimensions of tags, which can not only help you track the asset flows on the blockchain, but also offer you a comprehensive understanding of their sources, destinations, and involved industries. This can help you gain insights into the market trends and predict the future direction."
                  }
                </Text>
              </div>
            </div>
            <div className="mt2 flex flex-row w-full items-center justify-between">
              <div className="flex flex-column p2" style={{ width: "50%" }}>
                <h3>
                  Highly personalized - Flourishing with countless possibilities
                </h3>
                <Text className="mt1">
                  {
                    "Footprint GA can offer data analytical and query customization based on your specific needs. You can add your own tags to analyze and manage your digital assets more efficiently. This enables you to set up a personalized classification and management system for your assets, monitoring and managing your asset portfolios with ease."
                  }
                </Text>
              </div>
              <img
                className="mr3 pr4"
                src="https://footprint-imgs.oss-us-east-1.aliyuncs.com/img-why-about-us.png"
                style={{ width: "30%" }}
              ></img>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectObject: getFgaProject(state),
    // projectPath: props.params.project,
    // menu: props.params.menu,
  };
};

export default connect(mapStateToProps)(UserTemplate);
