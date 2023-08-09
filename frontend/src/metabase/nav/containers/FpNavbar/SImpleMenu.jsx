/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-component-props */
import React from "react";
import "./MainMenu.css";
import { Popover } from "antd";
import SimpleContent from "./components/SimpleContent";

const SimpleMenu = props => {
  const { content, menu, title, children } = props;
  const popoverContent = content ? content : (
    <SimpleContent
      rootClassName="single-menu__content"
      innerClassName="single-menu__inner"
      verticalMenuClassName="vertical-menu__layout"
      menu={menu}
      title={title}/>
  )
  const popoverStyle = {
    position: 'fixed',
    top: '50px',
    left: 'calc(50% - 570px)',
  };
  return (
    <div className="main-menu">
      <Popover
        content={popoverContent || "Coming soon..."}
        overlayClassName="main-menu__popover"
        color="#182034"
        overlayStyle={menu ? {} : popoverStyle}
        arrow={false}
        overlayInnerStyle={{
          borderRadius: 10,
          padding: 0,
          border: "1px solid #4A5568",
        }}
      >
        {children}
      </Popover>
    </div>
  );
};

export default SimpleMenu;
