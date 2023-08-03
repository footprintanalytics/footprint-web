import React, { useEffect, useRef } from "react";

import { isReducedMotionPreferred } from "metabase/lib/dom";

import Icon from "metabase/components/Icon";
import { SpinnerRoot } from "./LoadingSpinner.styled";
import lottie from "lottie-web/build/player/lottie_svg";
import { isWhiteLabel } from "metabase/lib/white_label";
import LoadingSpinnerData from "./LoadingSpinnerData";
import "./LoadingSpinnerFootprint.css";
import LoadingSpinnerDataNormal from "./LoadingSpinnerDataNormal";

interface Props {
  className?: string;
  size?: number;
  borderWidth?: number;
  message?: string;
}

const LoadingSpinner = ({ className, size = 32, borderWidth = 4, message }: Props) => {
  const ref: React.Ref<any> = useRef();
  const isAB = window.location.pathname.startsWith("/ab");
  useEffect(() => {
    lottie.loadAnimation({
      container: ref.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: isWhiteLabel || isAB
        ? LoadingSpinnerDataNormal
        : LoadingSpinnerData,
      rendererSettings: {
        svg: {
          filterSize: {
            width: `${size/32}%`,
            height: `${size/32}%`,
          }
        }
      }
    });
  }, []);

  return (
    <SpinnerRoot className={className} data-testid="loading-spinner">
      {isReducedMotionPreferred() ? (
        <Icon name="hourglass" size="24" />
      ) : (
        <div className="LoadingSpinner">
          <div ref={ref} className="LoadingSpinner__icon" />
          {!!message && <h3 className="LoadingSpinner__title">{message}</h3>}
        </div>
      )}
    </SpinnerRoot>
  );
}

export default Object.assign(LoadingSpinner, {
  Root: SpinnerRoot,
});
