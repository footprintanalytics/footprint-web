/* eslint-disable react/prop-types */
import React from "react";

const ClockIcon = ({
  hour = 12,
  minute = 40,
  width = 20,
  height = 20,
  className,
}) => (
  <svg
    width={width}
    height={height}
    className={className}
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.538 2.607c0-.652.685-1.207 1.338-1.207.652 0 1.359.555 1.359 1.208v5.197c0 .652-.521 1.446-1.173 1.446h-5.198c-.652 0-1.277-.71-1.277-1.363 0-.652.617-1.264 1.27-1.264h2.242C19.205 4.8 16.686 4.262 14 4.262c-5.654 0-9.855 4.084-9.855 9.738S8.346 23.795 14 23.795c5.654 0 9.774-4.141 9.774-9.795 0-.652.647-1.386 1.461-1.386.814 0 1.365.734 1.365 1.386 0 6.959-5.641 12.6-12.6 12.6S1.4 20.959 1.4 14 7.041 1.4 14 1.4c3.347 0 6.198.91 8.538 3.21.01.009.01-.658 0-2.003z"
      fill="#currentColor"
      fillRule="nonzero"
    />
  </svg>
);

export default ClockIcon;
