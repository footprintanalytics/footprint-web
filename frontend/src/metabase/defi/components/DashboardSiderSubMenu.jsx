/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React from "react";

const DashboardSiderSubMenu = ({
  userMenu,
  commonMenu,
  commonSubMenu,
  onClick,
}) => {
  if (commonMenu && commonSubMenu) {
    return (
      <ul className="defi-dashboard__sider-sub-menu">
        {commonMenu.children.map(item => (
          <li
            key={item.value}
            className={`defi-dashboard__sider-sub-menu-children ${
              commonSubMenu.value === item.value
                ? "defi-dashboard__sider-sub-menu-children--active"
                : ""
            }`}
            onClick={() => onClick({ secondLevelValue: item.label })}
          >
            <h4>{item.label}</h4>
          </li>
        ))}
      </ul>
    );
  }

  if (!userMenu) return null;

  return (
    <ul className="defi-dashboard__sider-sub-menu">
      {userMenu.secondAndThirdLevelList.map(s => (
        <li key={s.value} className="defi-dashboard__sider-sub-menu-parent">
          <h3>{s.label}</h3>
          <ul>
            {s.children.map(c => (
              <li
                key={c.uuid}
                className={`defi-dashboard__sider-sub-menu-children ${
                  userMenu.secondAndThirdLevel.uuid === c.uuid
                    ? "defi-dashboard__sider-sub-menu-children--active"
                    : ""
                }`}
                onClick={() =>
                  onClick({
                    secondLevelValue: s.label,
                    thirdLevelValue: c.label,
                  })
                }
              >
                <h4>{c.label}</h4>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default DashboardSiderSubMenu;
