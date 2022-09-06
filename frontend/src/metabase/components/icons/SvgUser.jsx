import * as React from "react";

function SvgComponent(props) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.638 10.418c1.947 0 3.784.763 5.17 2.15 1.387 1.386 2.15 3.058 2.15 5.005A2.429 2.429 0 0116.533 20H3.258a2.428 2.428 0 01-2.425-2.425c0-1.947.763-3.621 2.15-5.007a7.27 7.27 0 015.17-2.15h3.485zm2.077 3.098l-2.658 2.658-2.114-2.114a.625.625 0 00-.884 0l-2.876 2.876a.625.625 0 10.884.884L8.5 15.386l2.114 2.114c.244.244.64.244.884 0l3.1-3.1a.625.625 0 00-.884-.884zM9.895 0c2.703 0 4.902 2.2 4.902 4.903 0 2.704-2.199 4.903-4.903 4.903a4.908 4.908 0 01-4.902-4.903C4.992 2.199 7.19 0 9.894 0z"
        fill="currentColor"
        fillRule="nonzero"
      />
    </svg>
  );
}

export default SvgComponent;