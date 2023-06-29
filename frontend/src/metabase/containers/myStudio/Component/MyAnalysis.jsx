/* eslint-disable react/prop-types */
import React from "react";
import { useQuery } from "react-query";
import { personalInfo } from "metabase/new-service";
import { get } from "lodash";
import "./MyAnalysis.css";
import "../../creator/components/personal/index.css";
import { Skeleton } from "antd";
import List from "metabase/containers/creator/components/personal/list";

const MyAnalysis = props => {
  console.log("MyAnalysis")
  const { router, name, user } = props;
  const personalInfoParams = {
    name: name,
  };

  const { isLoading, data, error } = useQuery(
    ["personalInfo", personalInfoParams],
    async () => {
      return personalInfo(personalInfoParams);
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
    },
  );

  const totalInfo = [
    {
      title: "Dashboards",
      count: "dashboardTotal",
    },
    {
      title: "Charts",
      count: "cardTotal",
    },
    {
      title: "Views",
      count: "viewTotal",
    },
    {
      title: "Favorites",
      count: "favoriteTotal",
    },
  ];

  return (
    <>
      <div className={"my-analysis"}>
        <ul className="my-analysis__stat">
          {!isLoading ? totalInfo.map((item, index) => {
            return (
              <div
                key={item.title}
                className="creator__personal-right-item"
              >
                {index > 0 && (
                  <div className="creator__personal-right-item-split" />
                )}
                <div className="creator__personal-right-item-left">
                  <h3>{get(data, item.count)}</h3>
                  <div>{item.title}</div>
                </div>
              </div>
            );
          }) : <Skeleton active />
          }
        </ul>
        <div
          className="my__analysis"
          style={{ width: "100%", padding: "0px 20px" }}
        >
          <List
            key="my-analysis"
            user={user}
            name={name}
            location={router.location}
            router={router}
            showTabs={
              {
                all: true,
                dashboard: true,
                card: true,
                favorite: true,
                table: false,
              }
            }
          />
        </div>
      </div>
    </>
  );
};

export default MyAnalysis;
