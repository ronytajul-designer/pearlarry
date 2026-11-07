// Tabler-style outline icons (MIT), inlined to avoid an icon dependency.
const P = {
  search: ['c:10:10:7', 'M21 21l-6 -6'],
  cart: ['c:6:19:2', 'c:17:19:2', 'M17 17h-11v-14h-2', 'M6 5l14 1l-1 7h-13'],
  user: ['c:12:7:4', 'M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2'],
  menu: ['M4 8h16', 'M4 16h16'],
  x: ['M18 6l-12 12', 'M6 6l12 12'],
  leaf: ['M5 21c.5 -4.5 2.5 -8 7 -10', 'M9 18c6.218 0 10.5 -3.288 11 -12v-2h-4.014c-9 0 -11.986 4 -12 9c0 1 0 3 2 5h3z'],
  flask: ['M9 3l6 0', 'M10 9l4 0', 'M10 3v6l-4 11a.7 .7 0 0 0 .5 1h11a.7 .7 0 0 0 .5 -1l-4 -11v-6'],
  shield: ['M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06', 'M15 19l2 2l4 -4'],
  sparkles: ['M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z'],
  package: ['M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5', 'M12 12l8 -4.5', 'M12 12l0 9', 'M12 12l-8 -4.5', 'M16 5.25l-8 4.5'],
  heart: ['M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572'],
  smile: ['c:12:12:9', 'M9 10l.01 0', 'M15 10l.01 0', 'M9.5 15a3.5 3.5 0 0 0 5 0'],
  world: ['c:12:12:9', 'M3.6 9h16.8', 'M3.6 15h16.8', 'M11.5 3a17 17 0 0 0 0 18', 'M12.5 3a17 17 0 0 1 0 18'],
  arrows: ['M7 8l-4 4l4 4', 'M17 8l4 4l-4 4', 'M3 12l18 0'],
  plus: ['M12 5l0 14', 'M5 12l14 0'],
  minus: ['M5 12l14 0'],
  arrowUpRight: ['M17 7l-10 10', 'M8 7l9 0l0 9'],
  arrowRight: ['M5 12l14 0', 'M13 18l6 -6', 'M13 6l6 6'],
  check: ['M5 12l5 5l10 -10'],
}

export default function Icon({ name, size = 22, stroke = 1.6, className, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      {P[name].map((d, i) => {
        if (d.startsWith('c:')) {
          const [, cx, cy, r] = d.split(':')
          return <circle key={i} cx={cx} cy={cy} r={r} />
        }
        return <path key={i} d={d} />
      })}
    </svg>
  )
}
