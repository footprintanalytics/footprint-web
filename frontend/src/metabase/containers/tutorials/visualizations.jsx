/* eslint-disable react/jsx-no-target-blank */
import { getOssUrl } from "metabase/lib/image";
import { formatName } from "metabase/lib/urls";
import React from "react";
import { trackStructEvent } from "metabase/lib/analytics";

const Visualizations = () => {
  const list = [
    {
      title: "Sunburst",
      url: `https://www.footprint.network/guest/question/d42eb77d-bb03-4f26-af84-cd8e89e17bb9/${formatName(
        "Sunburst",
      )}`,
      thumb: getOssUrl("tutorials_visualizations_sunburst_card.png"),
      size: "120%",
    },
    {
      title: "Nested Pies",
      url: `https://www.footprint.network/guest/question/a96e1f10-00fb-4e3f-b909-4bf7a95ec318/${formatName(
        "Nested Pies",
      )}`,
      thumb: getOssUrl("tutorials_visualizations_nested_pies_card.png"),
      size: "180%",
    },
    {
      title: "Rose",
      url: `https://www.footprint.network/guest/question/b7ba18a8-4959-4c35-ae5d-8e882dbcd38f/${formatName(
        "Rose",
      )}`,
      thumb: getOssUrl("tutorials_visualizations_rose_card.png"),
      size: "170%",
    },
    {
      title: "Row Race",
      url: `https://www.footprint.network/guest/question/1378707a-a3d2-4dbd-8794-4785fb7e6699/${formatName(
        "Row Race",
      )}`,
      thumb: getOssUrl("tutorials_visualizations_row_race_card.png"),
      size: "100%",
    },
    {
      title: "Dynamic Pie",
      url: `https://www.footprint.network/guest/question/4b0b7b72-b359-43a3-b973-eb5158383aca/${formatName(
        "Dynamic Pie",
      )}`,
      thumb: getOssUrl("tutorials_visualizations_dynamic_pie_card.png"),
      size: "110%",
    },
    {
      title: "Waterfall",
      url: `https://www.footprint.network/guest/question/4075d46e-e8f6-4b5a-a1d0-e4d28a2b20cf/${formatName(
        "Waterfall",
      )}`,
      thumb: getOssUrl("tutorials_visualizations_waterfall_card.png"),
      size: "100%",
    },
    {
      title: "Circle",
      url: `https://www.footprint.network/guest/question/208ddd24-d6ce-4e61-9676-e8b7dba0dde5/${formatName(
        "Circle",
      )}`,
      thumb: getOssUrl("tutorials_visualizations_circle_card.png"),
      size: "120%",
    },
    {
      title: "Tree Map",
      url: `https://www.footprint.network/guest/question/9f919dff-07d0-401d-a02a-d745ee7511c4/${formatName(
        "Tree Map",
      )}`,
      thumb: getOssUrl("tutorials_visualizations_tree_map_card.png"),
      size: "110%",
    },
    {
      title: "Bubble",
      url: `https://www.footprint.network/guest/question/651ce2b7-2530-4654-b8ca-937e6c01162b/${formatName(
        "Bubble",
      )}`,
      thumb: getOssUrl("tutorials_visualizations_bubble_card.png"),
      size: "110%",
    },
  ];

  return (
    <ul className="tutorials__visualizations">
      {list.map(item => (
        <li key={item.title}>
          <div className="tutorials__visualizations-thumb">
            <a
              href={item.url}
              target="_blank"
              style={{
                backgroundImage: `url(${item.thumb})`,
                backgroundSize: item.size || "100%",
              }}
              onClick={() =>
                trackStructEvent(`Visualizations click link ${item.title}`)
              }
            >
              <img src={item.thumb} alt={item.title} />
            </a>
          </div>
          <h3 className="footprint-title2 footprint-pt-m">{item.title}</h3>
        </li>
      ))}
    </ul>
  );
};

export default Visualizations;
