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
      <g transform="translate(0 .898)" fill="#FFF" fillRule="evenodd">
        <circle opacity={0.4} cx={16} cy={16} r={16} />
        <g fillRule="nonzero">
          <path fillOpacity={0.01} d="M8 8h16v16H8z" />
          <path d="M21.714 11.429a1.143 1.143 0 011.143 1.142v9.143c0 .631-.512 1.143-1.143 1.143h-9.143a1.143 1.143 0 01-1.142-1.143v-9.143a1.143 1.143 0 011.142-1.142h9.143zM19.43 9.143a1.143 1.143 0 011.142 1.143v.171a.571.571 0 01-1.142 0v-.171h-9.143v9.143h.08a.571.571 0 010 1.142h-.08a1.143 1.143 0 01-1.143-1.142v-9.143c0-.631.512-1.143 1.143-1.143h9.143zm-2.286 4.571a.571.571 0 00-.562.469l-.01.103v2.285h-2.285a.571.571 0 00-.103 1.134l.103.01h2.285V20a.571.571 0 001.134.103l.01-.103v-2.286H20a.571.571 0 00.103-1.133L20 16.57h-2.286v-2.285a.571.571 0 00-.571-.572z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgComponent;
