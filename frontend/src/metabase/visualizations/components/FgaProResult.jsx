/* eslint-disable react/prop-types */
import React from "react";
import { Avatar, Result } from "antd";

const FgaProResult = ({
  card,
  cardId,
  subTitle,
  height,
  width,
  icon,
  extra = [],
}) => {

  const imgData = [
    {
      type: "scalar",
      img: "https://static.footprint.network/fga/pro/img_number.png",
    },
    {
      type: "smartscalar",
      img: "https://static.footprint.network/fga/pro/img_number.png",
    },
    {
      type: "bar",
      img: "https://static.footprint.network/fga/pro/img_bar.png",
    },
    {
      type: "line",
      img: "https://static.footprint.network/fga/pro/img_line.png",
    },
    {
      type: "combo",
      img: "https://static.footprint.network/fga/pro/img_bar_line.png",
    },
    {
      type: "pie",
      img: "https://static.footprint.network/fga/pro/img_pie.png",
    },
    {
      type: "table",
      img: "https://static.footprint.network/fga/pro/img_table.png",
    },
    {
      type: "row",
      img: "https://static.footprint.network/fga/pro/img_row.png",
    },
  ]
  const img = imgData?.find(item => item.type === card?.display)?.img || "https://static.footprint.network/fga/pro/img_number.png"

  return (
    <div className="flex w-full h-full" >
      <img src={img} style={{width: "100%", height: "100%", objectFit: "cover", filter: "blur(4px)",}} />
      {/*<Result
        style={{ padding: 0, width: "50%", flex: 1}}
        icon={null}
        subTitle={subTitle}
      >
        {extra}
      </Result>*/}
      <div className="flex flex-col justify-center items-center absolute bottom" style={{ width: "100%", height: "100%", gap: 10, backgroundColor: "#22222299"}}>
        <div style={{fontSize: 14, fontWeight: "bold"}}>{extra}</div>
        <div>{icon}</div>
        <div style={{fontSize: 16}}>{subTitle}</div>
      </div>
    </div>
  )
}

export default FgaProResult;
