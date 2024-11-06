/* eslint-disable react/prop-types */
import React from "react";
import { Avatar, Result } from "antd";

const FgaProResult = ({
  cardId,
  subTitle,
  height,
  width,
  icon,
  extra = [],
}) => {

  const imgData = [
    {
      cardId: 50934,
      img: "https://static.footprint.network/fga/pro/img_number_of_users.png",
    },
    {
      cardId: 50944,
      img: "https://static.footprint.network/fga/pro/img_total_users_wallet_link.png",
    },
    {
      cardId: 50935,
      img: "https://static.footprint.network/fga/pro/img_user_monthly_net.png",
    },
    {
      cardId: 50945,
      img: "https://static.footprint.network/fga/pro/img_monthly_user_wallet_link.png",
    },
  ]
  const img = imgData?.find(item => item.cardId === cardId)?.img || "https://static.footprint.network/fga/pro/img_number_of_users.png"
  return (
    <div className="flex w-full" >
      <div className="flex justify-center align-center" style={{width: "50%", overflow: "hidden"}}>
        <img src={img} style={{maxWidth: "100%", maxHeight: "100%", objectFit: "cover"}} />
      </div>
      {/*<Result
        style={{ padding: 0, width: "50%", flex: 1}}
        icon={null}
        subTitle={subTitle}
      >
        {extra}
      </Result>*/}
      <div className="flex flex-col justify-center items-center" style={{ padding: 0, width: "50%", flex: 1, gap: 10}}>
        {extra}
        <div>{icon}</div>
        <div>{subTitle}</div>
      </div>
    </div>
  )
}

export default FgaProResult;
