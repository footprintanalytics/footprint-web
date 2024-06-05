/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import "./Card.module.css";
import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import Link from "metabase/core/components/Link";
function Card({ imagen, title, link }) {
  const [show, setShown] = useState(false);

  const props3 = useSpring({
    transform: show ? "scale(1.03)" : "scale(1)",
    boxShadow: show
      ? "0 20px 25px rgb(0 0 0 / 25%)"
      : "0 2px 10px rgb(0 0 0 / 8%)",
  });
  const renderResult = () => {
    return (<animated.div
      className={`card2 ${link ? "cursor-pointer": ""}`}
      style={props3}
      onMouseEnter={() => setShown(true)}
      onMouseLeave={() => setShown(false)}
    >
      {imagen && <img src={imagen} alt=""
                      style={{ height: 410, width: 780, overflow: "hidden", borderRadius: 8, objectFit: "cover" }} />}
    </animated.div>)
  }
  if (!link) {
    return <>{renderResult()}</>
  }
  return (
    <Link to={link} target={"_blank"}>
      {renderResult()}
    </Link>
  );
}

export default Card;
