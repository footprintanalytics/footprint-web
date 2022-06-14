import * as React from "react";

function SvgComponent(props) {
  return (
    <svg
      width={32}
      height={33}
      viewBox="0 0 32 33"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g transform="translate(0 .898)" fill="none" fillRule="evenodd">
        <circle fill="#FFF" opacity={0.4} cx={16} cy={16} r={16} />
        <path
          d="M21.415 18.465c-.98 0-1.832.545-2.27 1.349l-4.08-1.061a3.522 3.522 0 00-.697-2.394l3.843-4.127a2.152 2.152 0 10-.915-.852l-3.842 4.126a3.538 3.538 0 101.297 4.456l4.08 1.061-.001.027a2.585 2.585 0 102.585-2.585z"
          fill="#FFF"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
}

export default SvgComponent;
