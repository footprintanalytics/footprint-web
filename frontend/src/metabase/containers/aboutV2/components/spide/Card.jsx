/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import "./Card.module.css";
import React, { useState } from "react";
import { useSpring, animated } from "react-spring";

function Card({ imagen, title, reports }) {
  const [show, setShown] = useState(false);

  const props3 = useSpring({
    transform: show ? "scale(1.03)" : "scale(1)",
    boxShadow: show
      ? "0 20px 25px rgb(0 0 0 / 25%)"
      : "0 2px 10px rgb(0 0 0 / 8%)"
  });
  return (
    <animated.div
      style={props3}
      onMouseEnter={() => setShown(true)}
      onMouseLeave={() => setShown(false)}
    >
      {reports && (
        <div className="flex flex-column gap-4" style={{height: 560, width: 800, background: "white", padding: 20}}>
          {reports.map((r, index) => {
            return (
              <div className="flex" key={index}>
                <div className={"flex flex-column"} style={{ flex: 1 }}>
                  <h4 style={{color: "#000000", fontSize: 18}}>{r.title}</h4>
                  <p style={{color: "#888888", fontSize: 14}}>{r.desc}</p>
                </div>
                <img src={r.image} style = {{width: 300, marginLeft: 10}} alt={r.title}/>
              </div>
            );
          })}
        </div>
      )}
      {imagen && <img src={imagen} alt="" style={{height: 560, width: 800}}/>}
    </animated.div>
  );
}

export default Card;
