/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-component-props */
import React, { useRef } from "react";
import "./MainMenu.css";
import { Popover, Button } from "antd";
import Icon from "../../../components/Icon";
import SimpleContent from "./components/SimpleContent";

const MainMenu = props => {
  const { name, content, menu, title,  } = props;
  const overlayRef = useRef(null);
  const popoverContent = content ? content : (<SimpleContent menu={menu} title={title}/>)
  const popoverStyle = {
    paddingLeft: "20px"
    // position: 'fixed',
    // top: '50px',
    // left: '50%',
    // transform: 'translate(-50%, 0)'
  };
  return (
    <nav className="main-menu">
      <Popover
        content={popoverContent || "Coming soon..."}
        overlayClassName="main-menu__popover"
        color="#182034"
        overlayStyle={popoverStyle}
        // overlayStyle={menu ? {} : popoverStyle}
        getPopupContainer={() => overlayRef.current}
        arrow={false}
        overlayInnerStyle={{
          borderRadius: 10,
          padding: 0,
          border: "1px solid #4A5568",
        }}
      >
        <Button type="text" ref={overlayRef}>
          {name}
          <Icon className="ml1" name="search_arrow_up" size={10} />
        </Button>
      </Popover>
    </nav>
  );
};

export default MainMenu;
