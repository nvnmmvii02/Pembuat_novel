interface IconProps {
  name: string;
  className?: string;
}

const PATHS: Record<string, React.ReactNode> = {
  nib: (
    <>
      <path d="M12 2l4.5 8L12 22 7.5 10 12 2z" />
      <circle cx="12" cy="10" r="1.8" />
      <path d="M12 11.8V17" />
    </>
  ),
  heart: <path d="M12 20.5S4 15.2 4 9.8C4 7 6.2 5 8.6 5c1.5 0 2.8.8 3.4 2 .6-1.2 1.9-2 3.4-2C17.8 5 20 7 20 9.8c0 5.4-8 10.7-8 10.7z" />,
  ghost: (
    <>
      <path d="M5 11a7 7 0 0 1 14 0v9l-2.3-1.8L14.4 20l-2.4-1.8L9.6 20l-2.3-1.8L5 20v-9z" />
      <circle cx="9.5" cy="10.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="10.5" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  bolt: <path d="M13 2L5 13.5h5.5L10 22l8-11.5h-5.5L13 2z" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5.5 5.5" />
    </>
  ),
  wand: (
    <>
      <path d="M5 19L15.5 8.5" />
      <path d="M17 3l.8 2.2L20 6l-2.2.8L17 9l-.8-2.2L14 6l2.2-.8L17 3z" />
      <path d="M6 4l.5 1.5L8 6l-1.5.5L6 8l-.5-1.5L4 6l1.5-.5L6 4z" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 15c5-3.5 7-8.5 7-12-3.5 0-8.5 2-12 7l-2.5.5L8 14l.5 3.5L12 15z" />
      <circle cx="14.5" cy="9.5" r="1.4" />
      <path d="M8 14l-4 4M9.5 17.5L7 20M6.5 14.5L4 17" />
    </>
  ),
  home: (
    <>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 9.5V20h12V9.5" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  smile: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 14.5c1 1.3 2.2 2 3.5 2s2.5-.7 3.5-2" />
      <circle cx="9" cy="9.8" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9.8" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  crosshair: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4" />
    </>
  ),
  flame: <path d="M12 22c4 0 7-2.8 7-6.7 0-3.4-2.3-5.6-4-7.3-.8-.8-2-2.5-2-5-2.8 1.8-4 4.5-4 6.5 0 1-.5 1.2-1 .6-.4-.5-.7-1.2-.7-2.1C5.7 9.6 5 11.7 5 15.3 5 19.2 8 22 12 22z" />,
  sprout: (
    <>
      <path d="M12 21v-8" />
      <path d="M12 13c0-3.5 2.5-6 7-6 0 4-2.5 6-7 6z" />
      <path d="M12 10C12 6.8 9.8 4.5 5 4.5c0 3.7 2.2 5.5 7 5.5z" />
      <path d="M7 21h10" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3.5" y="7.5" width="17" height="12" rx="2" />
      <path d="M9 7.5V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8v1.7" />
      <path d="M3.5 12.5h17M12 11v3" />
    </>
  ),
  flask: (
    <>
      <path d="M10 3h4M10.5 3v6L5 19a1.8 1.8 0 0 0 1.6 2.7h10.8A1.8 1.8 0 0 0 19 19L13.5 9V3" />
      <path d="M7.5 15.5h9" />
    </>
  ),
  scroll: (
    <>
      <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4z" />
      <path d="M6 4a2 2 0 0 0-2 2v1h4" />
      <path d="M9.5 9h5M9.5 12.5h5M9.5 16h3" />
    </>
  ),
  fingerprint: (
    <>
      <path d="M12 11a2 2 0 0 0-2 2c0 2.5-.5 4.5-1.5 6" />
      <path d="M15.5 13c0 2.8-.4 5-1.2 7" />
      <path d="M6.8 8.4A7 7 0 0 1 19 13" />
      <path d="M5 13a7 7 0 0 1 .6-2.8M8.5 20.2c.8-1.7 1.3-3.6 1.4-5.7" />
      <path d="M12 7.2a5.8 5.8 0 0 1 5.8 5.8" />
    </>
  ),
  dice: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="9" cy="9" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="15" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="15" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  back: <path d="M10.5 5L4 12l6.5 7M4 12h16" />,
  download: (
    <>
      <path d="M12 3v11M7.5 10L12 14.5 16.5 10" />
      <path d="M4 17v2.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V17" />
    </>
  ),
  copy: (
    <>
      <rect x="8.5" y="8.5" width="12" height="12" rx="2" />
      <path d="M15.5 5.5v-1a2 2 0 0 0-2-2h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h1" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.5-5.8" />
      <path d="M20 3v4.5h-4.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M3 20c.5-3.5 3-5.5 6-5.5s5.5 2 6 5.5" />
      <path d="M15.5 5.5a3.5 3.5 0 0 1 0 6M17.5 14.7c2 .8 3.2 2.6 3.5 5.3" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5z" />
      <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
    </>
  ),
  check: <path d="M4.5 12.5l5 5L19.5 7" />,
  play: <path d="M8 5.5v13l11-6.5L8 5.5z" />,
  skip: <path d="M5 5.5v13l8.5-6.5L5 5.5zM17.5 5v14" />,
  spark: <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />,
  chevron: <path d="M9 5l7 7-7 7" />,
  alert: (
    <>
      <path d="M12 3L1.8 20.5h20.4L12 3z" />
      <path d="M12 10v4.5" />
      <circle cx="12" cy="17.5" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  pen: (
    <>
      <path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1z" />
      <path d="M14.5 6.5l3 3" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3.5 12.5L12 17l8.5-4.5" />
      <path d="M3.5 16.5L12 21l8.5-4.5" />
    </>
  ),
};

export function Icon({ name, className = "w-5 h-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name] ?? PATHS.spark}
    </svg>
  );
}
