import * as React from "react";

function SvgComponent(props) {
  return (
    <svg
      width={20}
      height={19}
      viewBox="0 0 20 19"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.88 1.176l8.878 8.138a.745.745 0 01-.502 1.294h-.88v6.515a1.862 1.862 0 01-1.86 1.862H3.482a1.862 1.862 0 01-1.862-1.862v-6.516H.743a.745.745 0 01-.502-1.293l8.877-8.138a1.303 1.303 0 011.762 0zM6.865 12.702a.698.698 0 000 .974 4.384 4.384 0 006.278 0 .698.698 0 00-.008-.966.668.668 0 00-.948-.008 3.048 3.048 0 01-4.365 0 .67.67 0 00-.957 0z"
        fill="currentColor"
        fillRule="nonzero"
      />
    </svg>
  );
}

export default SvgComponent;
