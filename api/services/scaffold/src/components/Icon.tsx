import type { ReactNode, SVGProps } from "react";

const paths: Record<string, ReactNode> = {
  // Contact + nav
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z" />,
  whatsapp: <path d="M20.5 3.5A11 11 0 0 0 4.6 18.2L3 22l3.9-1.6A11 11 0 1 0 20.5 3.5Zm-4.4 14a4 4 0 0 1-2 .5 9 9 0 0 1-6.6-6.6 4 4 0 0 1 .5-2c.2-.4.5-.5.8-.5h.7c.3 0 .5.1.6.5l.7 1.8a.6.6 0 0 1-.1.6l-.5.6a.4.4 0 0 0-.1.5 6.5 6.5 0 0 0 3 3 .4.4 0 0 0 .5-.1l.6-.5a.6.6 0 0 1 .6-.1l1.8.7c.4.1.5.3.5.6v.7c0 .3-.1.6-.5.8Z" />,
  mail: (<><rect x="2" y="4" width="20" height="16" rx="4" /><polyline points="22 6 12 13 2 6" /></>),
  pin: (<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0Z" /><circle cx="12" cy="10" r="3" /></>),
  clock: (<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>),
  calendar: (<><rect x="3" y="4" width="18" height="18" rx="3" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" /></>),
  globe: (<><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 0 20a15.3 15.3 0 0 1 0-20z" /></>),

  // Arrows + UI
  arrow: <polyline points="9 6 15 12 9 18" />,
  arrowR: (<><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></>),
  arrowL: (<><line x1="19" y1="12" x2="5" y2="12" /><polyline points="11 18 5 12 11 6" /></>),
  arrowDown: <polyline points="6 9 12 15 18 9" />,
  arrowUp: <polyline points="6 15 12 9 18 15" />,
  check: <polyline points="20 6 9 17 4 12" />,
  plus: (<><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>),
  minus: <line x1="5" y1="12" x2="19" y2="12" />,
  menu: (<><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="17" x2="21" y2="17" /></>),
  close: (<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>),

  // Trust + value
  star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  shield: (<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><polyline points="9 12 11 14 15 10" /></>),
  award: (<><circle cx="12" cy="8" r="6" /><polyline points="8.21 13.89 7 22 12 19 17 22 15.79 13.88" /></>),
  certificate: (<><circle cx="12" cy="9" r="7" /><polyline points="8 14 7 22 12 18 17 22 16 14" /><line x1="12" y1="6" x2="12" y2="12" /></>),
  badge: (<><polygon points="12 2 15 8 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8 12 2" /></>),
  spark: (<><path d="M12 2v3" /><path d="M12 19v3" /><path d="M5 12H2" /><path d="M22 12h-3" /><path d="M4.93 4.93l2.12 2.12" /><path d="M16.95 16.95l2.12 2.12" /><path d="M16.95 7.05l2.12-2.12" /><path d="M4.93 19.07l2.12-2.12" /><circle cx="12" cy="12" r="3" /></>),
  smile: (<><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></>),
  heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
  leaf: <path d="M11 20A7 7 0 0 1 4 13V4h9a7 7 0 0 1 7 7v0a7 7 0 0 1-7 7Z" />,
  thumbsUp: <path d="M7 22V11M14 22h4a2 2 0 0 0 2-1.7L21.5 14a2 2 0 0 0-2-2.3H15V7a3 3 0 0 0-3-3l-2 4v14h4z" />,

  // People + team
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a8 8 0 0 1 16 0v1" /></>),
  users: (<><circle cx="9" cy="8" r="3.5" /><circle cx="17" cy="9" r="2.5" /><path d="M3 21v-1a6 6 0 0 1 12 0v1" /><path d="M15 21v-1a5 5 0 0 1 7 0v1" /></>),
  quote: (<><path d="M7 8h4v8H5v-4a4 4 0 0 1 2-4z" /><path d="M17 8h4v8h-6v-4a4 4 0 0 1 2-4z" /></>),

  // Social
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  instagram: (<><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>),
  twitter: <path d="M22 5.92a8.4 8.4 0 0 1-2.36.65 4.13 4.13 0 0 0 1.81-2.28 8.24 8.24 0 0 1-2.61 1 4.1 4.1 0 0 0-7 3.74A11.65 11.65 0 0 1 3.4 4.86a4.1 4.1 0 0 0 1.27 5.47 4.09 4.09 0 0 1-1.86-.51v.05a4.1 4.1 0 0 0 3.29 4.02 4.1 4.1 0 0 1-1.85.07 4.1 4.1 0 0 0 3.83 2.85A8.23 8.23 0 0 1 2 18.4a11.62 11.62 0 0 0 6.29 1.84c7.55 0 11.68-6.25 11.68-11.67 0-.18 0-.35-.01-.53A8.32 8.32 0 0 0 22 5.92z" />,
  youtube: (<><rect x="2" y="6" width="20" height="12" rx="3" /><polygon points="10 9 16 12 10 15 10 9" /></>),
  tiktok: <path d="M16 4v6a4 4 0 0 0 4 4M16 4h-3v12a4 4 0 1 1-4-4" />,
  linkedin: (<><rect x="2" y="2" width="20" height="20" rx="2" /><line x1="7" y1="10" x2="7" y2="17" /><circle cx="7" cy="7" r="1" /><path d="M11 17v-5a3 3 0 0 1 6 0v5" /><line x1="17" y1="12" x2="17" y2="17" /></>),

  // Plumbing
  boiler: (<><rect x="5" y="3" width="14" height="18" rx="3" /><line x1="5" y1="9" x2="19" y2="9" /><circle cx="12" cy="14" r="2.5" /><circle cx="9" cy="6" r=".5" /><circle cx="12" cy="6" r=".5" /><circle cx="15" cy="6" r=".5" /></>),
  drop: <path d="M12 2.69 5.64 9.05a9 9 0 1 0 12.73 0Z" />,
  radiator: (<><rect x="3" y="6" width="18" height="14" rx="3" /><line x1="7" y1="6" x2="7" y2="20" /><line x1="11" y1="6" x2="11" y2="20" /><line x1="15" y1="6" x2="15" y2="20" /><line x1="19" y1="6" x2="19" y2="20" /></>),
  bath: (<><path d="M2 13h20" /><path d="M4 13v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" /><path d="M6 13V6a2 2 0 0 1 2-2h1l2 2" /></>),
  pipes: (<><path d="M3 7h7v7" /><path d="M14 21V10h7" /><circle cx="10" cy="7" r="2" /><circle cx="14" cy="10" r="2" /></>),
  faucet: (<><path d="M12 4v6" /><path d="M8 10h8" /><path d="M9 10v3a3 3 0 0 0 6 0v-3" /><line x1="12" y1="16" x2="12" y2="22" /></>),
  salt: (<><path d="M5 9h14l-1.5 11h-11Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /><line x1="10" y1="13" x2="14" y2="17" /><line x1="14" y1="13" x2="10" y2="17" /></>),

  // Electrical
  bolt: <polygon points="13 2 4 14 11 14 11 22 20 10 13 10 13 2" />,
  plug: (<><line x1="9" y1="3" x2="9" y2="9" /><line x1="15" y1="3" x2="15" y2="9" /><path d="M6 9h12v3a6 6 0 0 1-12 0V9z" /><line x1="12" y1="18" x2="12" y2="22" /></>),
  bulb: (<><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 1 4 12.7V16H8v-1.3A7 7 0 0 1 12 2z" /></>),
  battery: (<><rect x="2" y="7" width="18" height="10" rx="2" /><line x1="22" y1="11" x2="22" y2="13" /><line x1="6" y1="11" x2="6" y2="13" /><line x1="10" y1="11" x2="10" y2="13" /><line x1="14" y1="11" x2="14" y2="13" /></>),

  // Construction + trades
  hammer: <path d="M14 2l8 8-3 3-2-2-7 7-3 3-3-3 3-3 7-7-2-2z" />,
  wrench: <path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-7 7a3 3 0 0 1-4-4l7-7-1.3-1.7z" />,
  hardhat: (<><path d="M3 19h18" /><path d="M5 19v-3a7 7 0 0 1 14 0v3" /><path d="M10 9V6a2 2 0 0 1 4 0v3" /></>),
  saw: (<><polyline points="3 7 7 11 11 7 15 11 19 7 22 10" /><path d="M3 11v3a3 3 0 0 0 3 3h12v4" /></>),
  ruler: (<><rect x="2" y="9" width="20" height="6" rx="1" transform="rotate(-12 12 12)" /><line x1="7" y1="11" x2="7" y2="13" /><line x1="11" y1="11" x2="11" y2="13" /><line x1="15" y1="11" x2="15" y2="13" /><line x1="19" y1="11" x2="19" y2="13" /></>),
  truck: (<><rect x="1" y="6" width="14" height="10" rx="1" /><path d="M15 9h4l3 4v3h-7V9z" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>),

  // Beauty + wellness
  scissors: (<><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" /></>),
  brush: <path d="M9 22a3 3 0 0 1-3-3c0-2 2-3 2-5l8-8 4 4-8 8c-2 0-3 2-5 2 1-1 2-1 2-3z" />,
  flower: (<><circle cx="12" cy="12" r="2" /><path d="M12 8a3 3 0 1 1 0-5 3 3 0 0 1 0 5z" /><path d="M12 21a3 3 0 1 1 0-5 3 3 0 0 1 0 5z" /><path d="M16 12a3 3 0 1 1 5 0 3 3 0 0 1-5 0z" /><path d="M3 12a3 3 0 1 1 5 0 3 3 0 0 1-5 0z" /></>),
  lotus: (<><path d="M12 21c-4-1-7-4-8-9 3 0 6 2 8 5 2-3 5-5 8-5-1 5-4 8-8 9z" /><path d="M12 16c-2-2-2-6 0-10 2 4 2 8 0 10z" /></>),

  // Restaurant + food
  fork: (<><path d="M9 2v8a3 3 0 0 0 6 0V2" /><line x1="12" y1="10" x2="12" y2="22" /></>),
  knife: <path d="M3 2l4 18h2L20 4l-2-2-8 9-5-9z" />,
  chef: (<><path d="M6 15v6h12v-6" /><path d="M6 15a4 4 0 0 1-2-4 5 5 0 0 1 8-4 5 5 0 0 1 8 4 4 4 0 0 1-2 4z" /></>),
  cup: (<><path d="M5 7h13v8a5 5 0 0 1-10 0V7z" /><path d="M18 8h2a3 3 0 0 1 0 6h-2" /><line x1="3" y1="21" x2="20" y2="21" /></>),
  wine: (<><path d="M8 2h8l-1 8a4 4 0 0 1-6 0z" /><line x1="12" y1="10" x2="12" y2="20" /><line x1="9" y1="22" x2="15" y2="22" /></>),

  // Legal + business
  gavel: (<><path d="M14 4l6 6-4 4-6-6 4-4z" /><path d="M9 9l6 6" /><path d="M4 20l8-8" /><line x1="3" y1="22" x2="13" y2="22" /></>),
  scale: (<><line x1="12" y1="3" x2="12" y2="21" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M3 6l3 8a3 3 0 0 0 6 0L9 6" /><path d="M15 6l3 8a3 3 0 0 0 6 0L21 6" /></>),
  book: (<><path d="M4 4h14a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z" /><line x1="4" y1="4" x2="4" y2="20" /></>),
  briefcase: (<><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></>),

  // Medical
  stethoscope: (<><path d="M6 2v6a4 4 0 0 0 8 0V2" /><path d="M10 12v2a5 5 0 0 0 10 0v-1" /><circle cx="20" cy="11" r="2" /></>),
  cross: (<><rect x="9" y="3" width="6" height="18" rx="1" /><rect x="3" y="9" width="18" height="6" rx="1" /></>),
  tooth: <path d="M12 2a5 5 0 0 0-5 5c0 2 1 4 1 7s-1 8 1 8 2-5 3-5 1 5 3 5 0-5 0-8 2-5 2-7a5 5 0 0 0-5-5z" />,
  pulse: <polyline points="2 12 6 12 9 4 13 20 16 12 22 12" />,

  // Tech
  laptop: (<><rect x="3" y="4" width="18" height="12" rx="2" /><line x1="1" y1="20" x2="23" y2="20" /></>),
  cpu: (<><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="6" y1="3" x2="6" y2="6" /><line x1="10" y1="3" x2="10" y2="6" /><line x1="14" y1="3" x2="14" y2="6" /><line x1="18" y1="3" x2="18" y2="6" /><line x1="6" y1="18" x2="6" y2="21" /><line x1="10" y1="18" x2="10" y2="21" /><line x1="14" y1="18" x2="14" y2="21" /><line x1="18" y1="18" x2="18" y2="21" /><line x1="3" y1="6" x2="6" y2="6" /><line x1="3" y1="10" x2="6" y2="10" /><line x1="3" y1="14" x2="6" y2="14" /><line x1="3" y1="18" x2="6" y2="18" /><line x1="18" y1="6" x2="21" y2="6" /><line x1="18" y1="10" x2="21" y2="10" /><line x1="18" y1="14" x2="21" y2="14" /><line x1="18" y1="18" x2="21" y2="18" /></>),
  cloud: <path d="M7 20a5 5 0 0 1-1-9.8 6 6 0 0 1 11.5-2 4.5 4.5 0 0 1 1 8.8z" />,
  code: (<><polyline points="8 8 3 13 8 18" /><polyline points="16 8 21 13 16 18" /><line x1="14" y1="4" x2="10" y2="22" /></>),
  lock: (<><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>),

  // Cleaning
  broom: (<><line x1="14" y1="3" x2="20" y2="9" /><path d="M14 3l-9 9 6 6 9-9z" /><path d="M11 18l-3 3-3-3 3-3" /></>),
  spray: (<><rect x="8" y="9" width="8" height="13" rx="1" /><path d="M10 9V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4" /><line x1="6" y1="5" x2="8" y2="5" /><line x1="6" y1="3" x2="8" y2="3" /><line x1="6" y1="7" x2="8" y2="7" /></>),
  sparkle: (<><path d="M12 3v4" /><path d="M12 17v4" /><path d="M3 12h4" /><path d="M17 12h4" /><path d="M6 6l3 3" /><path d="M15 15l3 3" /><path d="M18 6l-3 3" /><path d="M9 15l-3 3" /></>),
  bucket: (<><path d="M4 8h16l-2 13H6L4 8z" /><path d="M6 8a6 6 0 0 1 12 0" /></>),

  // Utility shapes
  grid: (<><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>),
  zap: <polygon points="13 2 4 14 11 14 11 22 20 10 13 10 13 2" />,
  cog: (<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.36.16.66.41.86.74.21.34.32.73.32 1.12V11a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>),
  building: (<><rect x="3" y="3" width="18" height="18" rx="1" /><line x1="9" y1="9" x2="9" y2="9.01" /><line x1="15" y1="9" x2="15" y2="9.01" /><line x1="9" y1="13" x2="9" y2="13.01" /><line x1="15" y1="13" x2="15" y2="13.01" /><line x1="9" y1="17" x2="9" y2="17.01" /><line x1="15" y1="17" x2="15" y2="17.01" /></>),
  home: <path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2v-9z" />,
};

const filledByDefault = new Set([
  "drop", "star", "facebook", "whatsapp", "bolt", "heart", "badge", "zap",
]);

type IconName = keyof typeof paths;

type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: IconName | string;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  filled?: boolean;
};

export default function Icon({
  name,
  size = 24,
  color = "currentColor",
  strokeWidth = 1.8,
  filled,
  className = "",
  ...rest
}: IconProps) {
  const node = paths[name as string];
  if (!node) return null;
  const isFilled = filled ?? filledByDefault.has(name as string);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFilled ? color : "none"}
      stroke={isFilled ? "none" : color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {node}
    </svg>
  );
}

export const ICON_NAMES = Object.keys(paths) as IconName[];
