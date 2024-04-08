/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";
import Icon from "metabase/components/Icon";

const AboutDepth = () => {

  const array = [
    {
      title: "Development",
      desc: "Reliable for efficient product \ndevelopment across domains.",
      advantage: ["High-quality", "Scalable", "Real-time"],
      background: getOssUrl("home-v2/img_solution_1.png?1=1"),
      icon: "home_solutions_1",
    },
    {
      title: "Research and Analysis",
      desc: "Effortless for cross-chain Web3 \ninsights.",
      advantage: ["Comprehensive", "Structured", "Curated"],
      background: getOssUrl("home-v2/img_solution_2.png"),
      icon: "home_solutions_2",
    },
    {
      title: "Marketing and Promotion",
      desc: "Easy for user identification and \ncampaign performance evaluation.",
      advantage: ["Informative", "Accurate", "Traceable"],
      background: getOssUrl("home-v2/img_solution_3.png"),
      icon: "home_solutions_3",
    },
    {
      title: "Financial Services",
      desc: "Timely for massive crypto assets \nand entities' money flow.",
      advantage: ["Standard", "Integrated", "Complete"],
      background: getOssUrl("home-v2/img_solution_4.png"),
      icon: "home_solutions_4",
    },
  ]

  return (
    <div className="About__solutions">
      <div className="About__depth-circle-bg" style={{ left: "8%" }}/>
      <h2 className="About__title">Data Solutions for Every Specific Need</h2>
      <div className="About__solutions-inner">
        {
          array.map(item => {
            return (
              <div className="About__solutions-inner-li" key={item.title} style={{ background: `url('${item.background}')` }}>
                <h3>
                  <Icon className="mr2" name={item.icon} size={28} style={{ marginRight: "12px", marginTop: "-4px" }}/>
                  {item.title}
                </h3>
                <div className="flex flex-column" style={{ marginLeft: 40 }}>
                  <span>{item.desc}</span>
                  <ul>
                    {item.advantage.map(a => {
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
              </div>
            )
          })
        }
      </div>
    </div>
  );
};

export default AboutDepth;
