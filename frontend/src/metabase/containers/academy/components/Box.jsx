/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/prop-types */
import React from "react";
import cx from "classnames";
import "../../tutorials/index.css";
import { trackStructEvent } from "metabase/lib/analytics";
import { updateTitle } from "metabase/hoc/Title";
import Link from "metabase/core/components/Link";
import Articles from "metabase/containers/news/articles";

const Box = ({ router, selectCategory }) => {
  const { subMenu } = router?.location?.query;
  const subMenus = selectCategory?.subMenus;
  const selectSubMenu =
    selectCategory?.subMenus?.find(item => item.value === subMenu) ||
    (selectCategory?.subMenus && selectCategory?.subMenus[0]);

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
            <Link
              key={item.label}
              to={`${router.location.pathname}?category=${selectCategory?.value}&subMenu=${item?.value}`}
              className={cx("edu__left-item", {
                "edu__left-item-select": item.value === selectSubMenu?.value,
              })}
              onClick={() => {
                trackStructEvent(
                  `academy click submenus ${selectCategory?.value}-${item?.value}`,
                );
                router.push(
                  `${router?.location?.pathname}?category=${selectCategory?.value}&subMenu=${item?.value}`,
                );
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
      {subMenus?.map(item => {
        if (selectSubMenu?.value === item?.value) {
          return (
            <Articles
              type={selectCategory?.value}
              tag={selectSubMenu?.value}
              location={router?.location}
              canShowHot={false}
              key={item.value}
              sortBy={selectCategory?.sortBy}
              sortDirection={selectCategory?.sortDirection}
              showPublishTime={selectCategory?.showPublishTime}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default Box;
