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
