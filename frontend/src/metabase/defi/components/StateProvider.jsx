/* eslint-disable react/prop-types */
import React, { createContext, useState } from "react";

export const StateContext = createContext({});

export const StateProvider = props => {
  const [value, setValue] = useState({
    isOpenSubMenu: true,
  });

  const handle = {
    setIsOpenSubMenu: isOpenSubMenu => setValue({ ...value, isOpenSubMenu }),
  };

  return (
    <StateContext.Provider value={{ ...value, ...handle }}>
      {props.children}
    </StateContext.Provider>
  );
};
