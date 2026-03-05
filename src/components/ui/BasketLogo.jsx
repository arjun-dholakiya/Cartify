/* Basket SVG logo for Cartify */
export default function BasketLogo({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Basket body */}
      <rect
        x="6"
        y="18"
        width="28"
        height="17"
        rx="4"
        fill="white"
        fillOpacity="0.2"
      />
      <rect
        x="6"
        y="18"
        width="28"
        height="17"
        rx="4"
        stroke="white"
        strokeWidth="2.2"
      />

      {/* Basket weave lines (vertical) */}
      <line
        x1="14"
        y1="18"
        x2="14"
        y2="35"
        stroke="white"
        strokeWidth="1.2"
        strokeOpacity="0.5"
      />
      <line
        x1="20"
        y1="18"
        x2="20"
        y2="35"
        stroke="white"
        strokeWidth="1.2"
        strokeOpacity="0.5"
      />
      <line
        x1="26"
        y1="18"
        x2="26"
        y2="35"
        stroke="white"
        strokeWidth="1.2"
        strokeOpacity="0.5"
      />

      {/* Basket weave lines (horizontal) */}
      <line
        x1="6"
        y1="24"
        x2="34"
        y2="24"
        stroke="white"
        strokeWidth="1.2"
        strokeOpacity="0.5"
      />
      <line
        x1="6"
        y1="29"
        x2="34"
        y2="29"
        stroke="white"
        strokeWidth="1.2"
        strokeOpacity="0.5"
      />

      {/* Handle (arc) */}
      <path
        d="M13 18 Q13 8 20 8 Q27 8 27 18"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Small items in basket */}
      <circle cx="15" cy="22" r="1.8" fill="white" fillOpacity="0.7" />
      <circle cx="20" cy="21.5" r="2" fill="white" fillOpacity="0.7" />
      <circle cx="25" cy="22" r="1.8" fill="white" fillOpacity="0.7" />
    </svg>
  );
}
