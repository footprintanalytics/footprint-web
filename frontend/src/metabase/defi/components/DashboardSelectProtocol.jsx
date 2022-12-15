/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React from "react";
import { Select } from "antd";
import { isDemo, DEMO_PROTOCOL_LIST } from "../utils/dashboard";

const DashboardSelectProtocol = ({ userMenu, onChange }) => {
  if (!userMenu) return null;

  if (isDemo()) {
    return (
      <Select
        defaultValue={userMenu.protocolName?.value}
        onChange={onChange}
        className="defi-dashboard__select"
      >
        {DEMO_PROTOCOL_LIST.map(item => (
          <Select.Option key={item.protocolName} value={item.protocolName}>
            {item.protocolName === "Dodo" ? "Abcswap" : item.protocolName}
          </Select.Option>
        ))}
      </Select>
    );
  }

  return (
    <Select
      defaultValue={userMenu.protocolName.value}
      onChange={onChange}
      className="defi-dashboard__select"
    >
      {userMenu.protocolNameList.map(item => (
        <Select.Option key={item.value} value={item.value}>
          {item.label === "Dodo" ? "DODO" : item.label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default DashboardSelectProtocol;
