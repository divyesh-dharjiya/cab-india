// Simple side-view car drawn in the cab's accent colour.
const CarIcon = ({ color, tall = false, ...props }) => (
  <svg viewBox="0 0 64 32" width="64" height="32" aria-hidden="true" {...props}>
    <path
      d={
        tall
          ? "M4 24V15c0-1.5 1-2.5 2.5-3L14 6h28c2 0 3.5.8 4.6 2.2L52 14l6 1.5c2 .5 3 1.8 3 3.5V24z"
          : "M4 24v-6c0-1.5 1-2.6 2.5-3L16 12l7-5.5C24.2 5.5 25.6 5 27 5h13c1.6 0 3 .7 4 2l5 6 8 1.5c2 .4 3.5 2 3.5 4V24z"
      }
      fill={color}
    />
    <path
      d={tall ? "M16 8.5h11V14H12.5zM30 8.5h11.5c1 0 1.8.4 2.4 1.2L47 14H30z" : "M26 8h7v5H20.5zM36 8h4c.8 0 1.5.3 2 1l3 4H36z"}
      fill="#E0F2FE"
    />
    <circle cx="17" cy="24" r="5" fill="#1F2937" />
    <circle cx="17" cy="24" r="2" fill="#E5E7EB" />
    <circle cx="48" cy="24" r="5" fill="#1F2937" />
    <circle cx="48" cy="24" r="2" fill="#E5E7EB" />
  </svg>
);

export default CarIcon;
