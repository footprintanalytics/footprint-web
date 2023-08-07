/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Icon from "metabase/components/Icon";
import "../index.css";
import { getFgaProject } from "metabase/selectors/user";
// eslint-disable-next-line import/order
import { connect } from "react-redux";
import { Select, Space, message } from "antd";

const UserFilter = props => {
  const [filters, setFilters] = useState([]);
  return (
    <div className="flex flex-column" style={{ gap: 10 }}>
      <div className="flex justify-between align-center">
        <h3>User Filter</h3>
        <Icon name="add" onClick={() => {
          if (filters.length >= 5) {
            message.info("Supports up to five user filters")
            return ;
          }
          setFilters([...filters, {}]);
        }} />
      </div>
      {filters.map((item, index) => {
        return (
          <Space key={index} wrap>
            <Select
              style={{ width: 120, borderRadius: 4, border: "1px solid #58585B", background: "#1B1B1E" }}
              dropdownStyle={{
                background: "#1C1C1E",
                color: "white",
                border: "1px solid #ffffff20"
              }}
              defaultValue="lucy"
              options={[
                {
                  value: "cohort1",
                  label: "Cohort1",
                },
                {
                  value: "cohort2",
                  label: "Cohort2",
                },
                {
                  value: "tag1",
                  label: "Tag1",
                },
                {
                  value: "tag2",
                  label: "Tag2",
                },
              ]}
            />

            <Select
              style={{ width: 120, borderRadius: 4, border: "1px solid #58585B", background: "#1B1B1E" }}
              dropdownStyle={{
                background: "#1C1C1E",
                color: "white",
                border: "1px solid #ffffff20"
              }}
              defaultValue="include"
              options={[
                {
                  value: "include",
                  label: "Include",
                },
                {
                  value: "exclude",
                  label: "Exclude",
                },
              ]}
            />
          </Space>
        );
      })}
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    projectObject: getFgaProject(state),
  };
};

export default connect(
  mapStateToProps,
  null,
)(UserFilter);
