/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from "react";
import lottie from "lottie-web/build/player/lottie_svg";
import LoadingSpinnerData from "./LoadingSpinnerData";
import "./LoadingSpinner.css";

export default function LoadingSpinner({ message }) {
  const ref = useRef();

  useEffect(() => {
    lottie.loadAnimation({
      container: ref.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: LoadingSpinnerData,
    });
  }, []);

  return (
    <div className="LoadingSpinner">
      <div ref={ref} className="LoadingSpinner__icon" />
      {!!message && <h3 className="LoadingSpinner__title">{message}</h3>}
    </div>
  );
}
