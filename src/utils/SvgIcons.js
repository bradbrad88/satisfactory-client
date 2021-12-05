export const hamburgerMenu = (size = 24) => (
  <svg
    className={"icon menu"}
    xmlns="http://www.w3.org/2000/svg"
    height={`${size}px`}
    viewBox="0 0 24 24"
    width={`${size}px`}
    fill="#000000"
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
  </svg>
);

export const add = (size = 24) => (
  <svg
    className={"icon add"}
    xmlns="http://www.w3.org/2000/svg"
    height={`${size}px`}
    viewBox="0 0 24 24"
    width={`${size}px`}
    fill="#000000"
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

export const building = (size = 24) => (
  <svg
    className={"icon building"}
    xmlns="http://www.w3.org/2000/svg"
    enable-background="new 0 0 24 24"
    height={`${size}px`}
    viewBox="0 0 24 24"
    width={`${size}px`}
    fill="#000000"
  >
    <g>
      <rect fill="none" height="24" width="24" />
    </g>
    <g>
      <path d="M22,22H2V10l7-3v2l5-2l0,3h3l1-8h3l1,8V22z M12,9.95l-5,2V10l-3,1.32V20h16v-8h-8L12,9.95z M11,18h2v-4h-2V18z M7,18h2v-4 H7V18z M17,14h-2v4h2V14z" />
    </g>
  </svg>
);

export const recipe = (size = 24) => (
  <svg
    className={"icon recipe"}
    xmlns="http://www.w3.org/2000/svg"
    height={`${size}px`}
    viewBox="0 0 24 24"
    width={`${size}px`}
    fill="#000000"
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M11 7h6v2h-6zm0 4h6v2h-6zm0 4h6v2h-6zM7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zM20.1 3H3.9c-.5 0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9zM19 19H5V5h14v14z" />
  </svg>
);

export const item = (size = 24) => (
  <svg
    className={"icon item"}
    xmlns="http://www.w3.org/2000/svg"
    enableBackground="new 0 0 20 20"
    height={`${size}px`}
    viewBox="0 0 20 20"
    width={`${size}px`}
    fill="#000000"
  >
    <g>
      <rect fill="none" height="20" width="20" x="0" />
    </g>
    <g>
      <g>
        <path d="M10,3c-3.86,0-7,3.14-7,7s3.14,7,7,7s7-3.14,7-7S13.86,3,10,3z M10,16c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6 S13.31,16,10,16z" />
        <path d="M10.75,7.21C9.98,6.44,8.83,6.3,7.91,6.78l1.63,1.63L8.51,9.44L6.88,7.81C6.4,8.73,6.54,9.88,7.31,10.65 c0.66,0.66,1.61,0.85,2.45,0.59l2.26,2.26l1.38-1.38l-2.17-2.17C11.64,9.05,11.49,7.95,10.75,7.21z" />
      </g>
    </g>
  </svg>
);

export const drag = (size = 24) => (
  <svg
    className={"icon drag"}
    xmlns="http://www.w3.org/2000/svg"
    height={`${size}px`}
    viewBox="0 0 24 24"
    width={`${size}px`}
    fill="#000000"
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

export const reorder = (size = 24) => (
  <svg
    className={"icon reorder"}
    xmlns="http://www.w3.org/2000/svg"
    height={`${size}px`}
    viewBox="0 0 24 24"
    width={`${size}px`}
    fill="#000000"
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M3 15h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V9H3v2zm0-6v2h18V5H3z" />
  </svg>
);

export const newStep = (size = 24) => (
  <svg
    className={"icon new-step"}
    xmlns="http://www.w3.org/2000/svg"
    height={`${size}px`}
    viewBox="0 0 24 24"
    width={`${size}px`}
    fill="#000000"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
  </svg>
);

export const centreMap = (size = 24) => (
  <svg
    className={"icon centre"}
    xmlns="http://www.w3.org/2000/svg"
    height={`${size}px`}
    viewBox="0 0 24 24"
    width={`${size}px`}
    fill="#000000"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-7 7H3v4c0 1.1.9 2 2 2h4v-2H5v-4zM5 5h4V3H5c-1.1 0-2 .9-2 2v4h2V5zm14-2h-4v2h4v4h2V5c0-1.1-.9-2-2-2zm0 16h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4z" />
  </svg>
);

export const edit = (size = 24) => (
  <svg
    className={"icon edit"}
    xmlns="http://www.w3.org/2000/svg"
    height={`${size}px`}
    viewBox="0 0 24 24"
    width={`${size}px`}
    fill="#000000"
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" />
  </svg>
);
