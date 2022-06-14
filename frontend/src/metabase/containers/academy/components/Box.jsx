/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/prop-types */
import React from "react";
import cx from "classnames";
import Content from "./Content";
import Visualizations from "metabase/containers/tutorials/visualizations";
import "../../tutorials/index.css";
import { trackStructEvent } from "metabase/lib/analytics";
import { updateTitle } from "metabase/hoc/Title";

const Box = ({ router, selectCategory }) => {
  const { subMenu } = router?.location?.query;
  const subMenus = selectCategory?.subMenus;
  const selectSubMenu =
    selectCategory?.subMenus?.find(item => item.value === subMenu) ||
    (selectCategory?.subMenus && selectCategory?.subMenus[0]);

  // show the special case ui
  if (selectCategory?.value === "Feature Charts") {
    return (
      <div className="edu__root">
        <Visualizations />
      </div>
    );
  }

  if (selectCategory && selectSubMenu) {
    updateTitle(`${selectCategory.label} - ${selectSubMenu.label}`);
  } else if (selectCategory) {
    updateTitle(`${selectCategory.label}`);
  }

  return (
    <div className="edu__root">
      <div className="edu__left-container">
        {subMenus?.map((item, index) => {
          return (
            <div
              key={item.label}
              className={cx("edu__left-item", {
                "edu__left-item-select": item.value === selectSubMenu?.value,
              })}
              onClick={() => {
                trackStructEvent(
                  `academy click submenus ${selectCategory?.value}-${item?.value}`,
                );
                router.push(
                  `academy?category=${selectCategory?.value}&subMenu=${item?.value}`,
                );
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>
      <Content
        category={selectCategory?.value}
        subMenu={selectSubMenu?.value}
        router={router}
      />
    </div>
  );
};

export default Box;
