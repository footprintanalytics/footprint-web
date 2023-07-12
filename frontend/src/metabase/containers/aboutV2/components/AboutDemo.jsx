/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";
import AboutButton from "metabase/containers/aboutV2/components/AboutButton";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";
import Icon from "metabase/components/Icon";
import { message } from "antd";
const AboutDemo = () => {
  const toolsData = [
    {
      "img": getOssUrl("home-v2/img_demo_tool_1.png"),
      "title": "Website Embedment",
      "desc": "0-coding website builder for all the developers and KOLs",
      "content": "Free embed Footprint Research Portal, Dashboards, or Apps you make with one click to build your website",
      "buttonText": "How to embed",
      "buttonLink": "https://docs.footprint.network/docs/embed",
    },
    {
      "img": getOssUrl("home-v2/img_demo_tool_2.png"),
      "title": "Find Wallets",
      "desc": "Find eligible wallet addresses in 26 chains for airdrops or other \nmarketing campaigns",
      "content": "Get the current and historical portfolio and transactions data of \nspecific tokens or protocols",
      "buttonText": "Coming Soon",
    },
  ]

  const renderBlock = ({ item, style }) => {
    return (
      <div className="About__demo-block" style={style}>
        <AboutImage
          src={getOssUrl(item.img)}
          alt={item.title}
        />
        <div className="About__demo-block-title">{item.title}</div>
        <div className="About__demo-block-desc">{item.desc}</div>
        <AboutButton buttonText={item.buttonText} link={item.buttonLink}/>
      </div>
    )
  }

  const renderToolBlock = ({ item, style }) => {
    return (
      <div className="About__demo-tool-block" style={style}>
        <div className="flex align-center">
          <AboutImage
            src={getOssUrl(item.img)}
            alt={item.title}
          />
          <div className="About__demo-tool-block-title">{item.title}</div>
        </div>
        <div className="About__demo-tool-block-desc">{item.desc}</div>
        <div className="About__demo-tool-block-content">{item.content}</div>
        <AboutButton buttonText={item.buttonText} link={item.buttonLink} onClick={item.action}/>
      </div>
    )
  }
  const data = [
    {
      title: "Analytics Studio",
      desc: "0-coding analytics as Tableau for crypto",
      content: <span>Use Footprint real-time on-chain and uploaded data to showcase cutting-edge <br/>insights using a drag-and-drop interface or SQL. Build a website in minutes to <br/>brand yourself.</span>,
      buttons: [
        {
          buttonText: "Explore Analytics Studio",
          link: "https://www.footprint.network/dashboards",
        }
      ],
      image: "home-v2/img-demo-3-1.png",
      bg: "home-v2/img-demo-3-2.png",
      render: (
        <div className="flex flex-column align-center">
          <AboutImage
            src={getOssUrl("home-v2/img_demo_studio_1.png")}
            alt={"studio1"}
          />
          <div className="mt2" />
          <AboutImage
            src={getOssUrl("home-v2/img_demo_studio_2.png")}
            alt={"studio1"}
          />
          <div className="mt2" />
          <AboutImage
            src={getOssUrl("home-v2/img_demo_studio_3.png")}
            alt={"studio1"}
          />
        </div>
      )
    },
    {
      title: "Tools",
      image: "home-v2/img-demo-4-1.png",
      bg: "home-v2/img-demo-4-2.png?1=1",
      render: (
        <div>
          {
            toolsData?.map(item => {
              return (
                <div key={item.title}>
                  {renderToolBlock({item})}
                </div>
              )
            })
          }
        </div>
      )
    },
  ];

  const advantage = [
    "Balance API",
    "Money Flow API",
    "Transaction API",
    "Transfer API",
    "Ownership API",
    "NFT API",
    "Reference Data API",
  ]

  const blockData = [
    {
      "img": getOssUrl("home-v2/img_demo_1.png"),
      "title": "REST API",
      "desc": "One unified API for Web3 developers",
      "buttonText": "Explore Data API",
      "buttonLink": "https://docs.footprint.network/reference/introduction",
    },
    {
      "img": getOssUrl("home-v2/img_demo_2.png"),
      "title": "SQL API",
      "desc": "A flexible SQL API customization for robust requirements",
      "buttonText": "Explore SQL API",
      "buttonLink": "https://docs.footprint.network/reference/examples",
    },
    {
      "img": getOssUrl("home-v2/img_demo_3.png"),
      "title": "Batch Download",
      "desc": "Sync blockchain historical data in one batch",
      "buttonText": "Explore Batch Download",
      "buttonLink": "https://www.footprint.network/batch-download",
    },
  ]

  return (
    <div className="About__demo">
      <div className="About__depth-circle-bg" style={{ top: "200px", background: "rgba(68, 68, 255, 0.40)"}}/>
      <div className="About__title my4">Flagship Products and Services</div>

      <div className="About__demo-analytics-app About__demo-data-api"
           style={{ backgroundSize: "cover", backgroundImage: `url("${getOssUrl("home-v2/img-demo-1-5.png?1=1")}")` }}>
        <div className="About__demo-top" style={{ paddingLeft: 60 }}>
          <h3>Data API</h3>
          <h4>Build your application with the Data API</h4>
          <span>Everything you need to build in Web3</span>
          <ul>
            {advantage.map(a => {
              return (
                <li key={a}>
                  <div style={{
                    width: 16,
                    height: 16,
                    background: "#2FD6B8",
                    paddingLeft: "1px",
                    lineHeight: "20px",
                    marginRight: "12px",
                  }}>
                    <Icon name="home_solutions_li" color="white" size={14}/>
                  </div>
                  {a}
                </li>
              )
            })}
          </ul>
        </div>
        <div className="About__demo-top-right">
          {renderBlock({ item: blockData[0] })}
          <div className="About__demo-top-right-bottom" style={{ marginTop: "40px" }}>
            {renderBlock({ item: blockData[1] })}
            {renderBlock({ item: blockData[2], style: { marginLeft: "40px" } })}
          </div>
        </div>
      </div>

      <div className="About__demo-bottom">
        {data.map(item => {
          return (
            <div key={item.title} className="About__demo-analytics-app" style={{ backgroundImage: `url("${getOssUrl(item.bg)}")`}}>
              <div style={{ paddingLeft: 60 }}>
                {item.title && (<h3>{item.title}</h3>)}
                {item.desc && (<h4>{item.desc}</h4>)}
                {item.content}
                <div className="About__demo-data-api-buttons">
                  {item.buttons?.map(button => {
                    return (
                      <AboutButton
                        key={button.buttonText}
                        className="mt4 mb4"
                        buttonText={button.buttonText}
                        link={button.link}
                      />
                    )
                  })}
                </div>
              </div>
              {item.render}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default AboutDemo;
