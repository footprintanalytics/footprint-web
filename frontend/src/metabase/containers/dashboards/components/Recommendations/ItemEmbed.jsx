/* eslint-disable react/prop-types */
import React, { useRef } from "react";
import ItemCommon from "./ItemCommon";

const ItemEmbed = ({ item, user, test }) => {
  const ref = useRef();
  const sendIframeMessage = () => {
    if (window?.location?.origin?.includes("footprint.network") || window?.location?.origin?.includes("localhost")) {
      // ref?.current?.contentWindow?.postMessage(`user=${JSON.stringify(user)}`, window.location.origin);
    }
  }
  return (
    <>
      <iframe
        ref={ref}
        width="100%"
        height="100%"
        src={item.mediaUrl}
        frameBorder="0"
        allowFullScreen
        onLoad={sendIframeMessage}
        // scrolling="no"
      />
      <ItemCommon url={item.url} name={item.name} target="_blank" />
    </>
  );
};

export default ItemEmbed;
