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
      "desc": "Zero-coding website builder for all the developers and KOLs",
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
        <h4 className="About__demo-block-title">{item.title}</h4>
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
      title: "Analytics",
      desc: "Zero-Coding Analytics as Tableau for Crypto",
      content: <span>Use Footprint real-time on-chain and uploaded data to showcase cutting-edge <br/>insights using a drag-and-drop interface or SQL. </span>,
      buttons: [
        {
          buttonText: "Explore Dashboards",
          link: "https://www.footprint.network/dashboards",
        }
      ],
      image: "home-v2/img-demo-3-1.png",
      bg: "home-v2/img-data-analytics.png",
      render: (
        <div className="flex flex-column align-center">
        </div>
      )
    },
    {
      title: "Growth Analytics",
      desc: "All-In-One Analytics That Catalyze Growth.",
      content: <span>Integrate Web3 and Web2 data seamlessly with our automated workflows.</span>,
      image: "home-v2/img-demo-4-1.png",
      bg: "home-v2/img-data-growth-analytics.png",
      buttons: [
        {
          buttonText: "Explore Growth Analytics",
          link: "https://www.footprint.network/fga",
        }
      ],
      render: (
        <div>
        </div>
      )
    },
  ];

  const advantage = [
    "Cross-Chain",
    "Real-Time",
    "Full Historical Data",
    "Ease of Use Abstraction",
  ]

  const blockData = [
    {
      "img": getOssUrl("home-v2/img_demo_2.png"),
      "title": "REST API",
      "desc": "Everything you need to build in Web3.",
      "buttonText": "Explore Data API",
      "buttonLink": "https://docs.footprint.network/reference/introduction",
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
      <div className="About__depth-circle-bg" style={{ top: "100px", background: "rgba(68, 68, 255, 0.40)"}}/>
      <h2 className="About__title my4">Data Products Suite</h2>

      <div className="About__demo-data-api">
        <div className="About__demo-top" style={{ paddingLeft: 60 }}>
          <h3>Data Room</h3>
          <h4>Structured, Human-Readable Simple Blockchain Data.</h4>
          <span>Gain access to a wide array of abstracted datasets, <br/>facilitating effortless data exploration and empowering the creation of <br/>next-generation applications whenever required.</span>
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
          {renderBlock({ item: blockData[0], style: { marginRight: "200px" }})}
          <div className="About__demo-top-right-bottom" style={{ marginTop: "40px" }}>
            {renderBlock({ item: blockData[1], style: { marginLeft: "200px" } })}
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
                <div className="About__demo-data-api-content">{item.content}</div>
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
