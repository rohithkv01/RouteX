import { useEffect } from 'react'

const KEYFRAMES = `
@keyframes rx-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes rx-bus-ride { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-1.5px); } }
@keyframes rx-steam { 0% { transform: translateY(0) scale(0.5); opacity: 0.9; } 100% { transform: translateY(-16px) scale(2); opacity: 0; } }
@keyframes rx-engine-glow { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
@keyframes rx-float-plane { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }
@keyframes rx-trail { 0% { opacity: 0.55; transform: scaleX(1); } 100% { opacity: 0; transform: scaleX(0.1); } }
@keyframes rx-beacon { 0%,100% { opacity: 0.2; r: 2px; } 50% { opacity: 1; r: 3px; } }
`

function injectKeyframes() {
  if (typeof document !== 'undefined' && !document.getElementById('rx-transport-anim')) {
    const s = document.createElement('style')
    s.id = 'rx-transport-anim'
    s.textContent = KEYFRAMES
    document.head.appendChild(s)
  }
}

// ─── WHEEL helper ────────────────────────────────────────────────────────────
function Wheel({ cx, cy, r = 9, animated }) {
  return (
    <g transform={`translate(${cx},${cy})`}>
      <circle r={r} fill="#374151" />
      <circle r={r - 1.5} fill="#1F2937" />
      <circle r={r - 1} fill="none" stroke="#6B7280" strokeWidth="0.8" />
      <g style={animated ? { animation: 'rx-spin 0.8s linear infinite' } : {}}>
        {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5].map((deg, i) => (
          <line key={i} x1="0" y1={-(r - 2)} x2="0" y2={r - 2}
            stroke="#9CA3AF" strokeWidth="0.6" transform={`rotate(${deg})`} />
        ))}
      </g>
      <circle r="2.2" fill="#D1D5DB" />
    </g>
  )
}

// ─── BUS ICON ────────────────────────────────────────────────────────────────
export function BusIcon({ size = 80, animated = true }) {
  useEffect(() => { injectKeyframes() }, [])
  const a = animated
  return (
    <svg viewBox="0 0 100 58" width={size} height={size * 0.58} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="rx-busBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBBF24" /><stop offset="60%" stopColor="#F59E0B" /><stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="rx-busRoof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1C1917" /><stop offset="100%" stopColor="#292524" />
        </linearGradient>
        <filter id="rx-hglow"><feGaussianBlur stdDeviation="1.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <ellipse cx="50" cy="56" rx="37" ry="2" fill="rgba(0,0,0,0.15)" />
      <g style={a ? { animation: 'rx-bus-ride 1.4s ease-in-out infinite' } : {}}>
        <rect x="12" y="33" width="68" height="5" rx="2" fill="#111827" />
        <rect x="5" y="9" width="82" height="27" rx="5" fill="url(#rx-busBody)" />
        <rect x="5" y="29" width="82" height="7" rx="0" fill="rgba(0,0,0,0.18)" />
        <rect x="5" y="9" width="82" height="8" rx="5" fill="url(#rx-busRoof)" />
        <rect x="5" y="13" width="82" height="4" fill="url(#rx-busRoof)" />
        {/* Route sign */}
        <rect x="28" y="3" width="32" height="7" rx="2.5" fill="#111827" stroke="#F59E0B" strokeWidth="0.5" />
        <circle cx="36" cy="6.5" r="1" fill="#ef233c" />
        <circle cx="42" cy="6.5" r="1" fill="#F59E0B" />
        <circle cx="48" cy="6.5" r="1" fill="#22c55e" />
        {/* Side windows */}
        {[11, 24, 37, 49].map((x, i) => (
          <g key={i}>
            <rect x={x} y="18" width="10" height="10" rx="1.5" fill="#1D4ED8" opacity="0.75" />
            <rect x={x + 1} y="19" width="3" height="4" rx="0.8" fill="rgba(255,255,255,0.45)" />
          </g>
        ))}
        {/* Windshield */}
        <rect x="63" y="15" width="17" height="13" rx="2" fill="#1D4ED8" opacity="0.75" />
        <rect x="64" y="16" width="5" height="5" rx="1" fill="rgba(255,255,255,0.4)" />
        {/* Cab */}
        <rect x="80" y="18" width="7" height="18" rx="3" fill="#B45309" />
        {/* Headlight */}
        <ellipse cx="88" cy="22" rx="4.5" ry="3" fill="#FDE68A" filter="url(#rx-hglow)"
          style={a ? { animation: 'rx-engine-glow 2s ease-in-out infinite' } : {}} />
        <ellipse cx="88" cy="22" rx="2.5" ry="1.8" fill="#FFFBEB" />
        {/* Taillights */}
        <rect x="5" y="18" width="2.5" height="7" rx="1" fill="#EF4444" />
        <rect x="5" y="26" width="2.5" height="3" rx="1" fill="#FCA5A5" />
        {/* Door */}
        <rect x="13" y="22" width="9" height="16" rx="1.5" fill="rgba(0,0,0,0.28)" stroke="rgba(0,0,0,0.4)" strokeWidth="0.5" />
        <line x1="17.5" y1="22" x2="17.5" y2="38" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
        <rect x="18.5" y="29" width="1.5" height="4" rx="0.5" fill="#F59E0B" opacity="0.7" />
        <Wheel cx={22} cy={41} r={8.5} animated={a} />
        <Wheel cx={73} cy={41} r={8.5} animated={a} />
        <rect x="14" y="36" width="63" height="2" rx="1" fill="#78350F" opacity="0.5" />
      </g>
    </svg>
  )
}

// ─── TRAIN ICON ──────────────────────────────────────────────────────────────
export function TrainIcon({ size = 80, animated = true }) {
  useEffect(() => { injectKeyframes() }, [])
  const a = animated
  const TrainWheel = ({ cx, cy, r = 9 }) => (
    <g transform={`translate(${cx},${cy})`}>
      <circle r={r} fill="#4C1D95" />
      <circle r={r - 1.5} fill="#3B0764" />
      <circle r={r - 1} fill="none" stroke="#7C3AED" strokeWidth="0.8" />
      <g style={a ? { animation: 'rx-spin 0.7s linear infinite' } : {}}>
        {[0, 30, 60, 90, 120, 150].map((deg, i) => (
          <line key={i} x1="0" y1={-(r - 2)} x2="0" y2={r - 2}
            stroke="#A78BFA" strokeWidth="0.7" transform={`rotate(${deg})`} />
        ))}
      </g>
      <circle r="2.2" fill="#C4B5FD" />
    </g>
  )
  return (
    <svg viewBox="0 0 110 62" width={size} height={size * 0.565} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="rx-trainBoiler" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6D28D9" /><stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
        <linearGradient id="rx-trainCab" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
        <filter id="rx-trainGlow"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {/* Track */}
      <line x1="0" y1="55" x2="110" y2="55" stroke="#374151" strokeWidth="2.5" />
      <line x1="0" y1="57" x2="110" y2="57" stroke="#374151" strokeWidth="2.5" />
      {[5, 20, 35, 50, 65, 80, 95].map(x => (
        <rect key={x} x={x} y="53.5" width="10" height="5" rx="0.5" fill="#1F2937" />
      ))}
      {/* Shadow */}
      <ellipse cx="55" cy="56" rx="42" ry="2" fill="rgba(0,0,0,0.2)" />

      <g style={a ? {} : {}}>
        {/* Running board */}
        <rect x="10" y="32" width="82" height="4" rx="1" fill="#3B0764" />
        {/* Boiler */}
        <rect x="22" y="14" width="60" height="20" rx="4" fill="url(#rx-trainBoiler)" />
        <ellipse cx="22" cy="24" rx="5" ry="10" fill="#4C1D95" />
        {/* Boiler belly shading */}
        <rect x="22" y="27" width="60" height="7" rx="0" fill="rgba(0,0,0,0.2)" />
        {/* Dome */}
        <ellipse cx="65" cy="13" rx="7" ry="5" fill="#7C3AED" />
        <ellipse cx="65" cy="11" rx="5" ry="3" fill="#8B5CF6" />
        {/* Chimney */}
        <rect x="26" y="5" width="8" height="10" rx="1.5" fill="#3B0764" />
        <rect x="24" y="4" width="12" height="3" rx="1.5" fill="#4C1D95" />
        {/* Steam puffs */}
        {a && [0, 0.4, 0.8].map((delay, i) => (
          <circle key={i} cx={30 + i * 4} cy="3" r="3"
            fill="rgba(167,139,250,0.6)"
            style={{ animation: `rx-steam 1.2s ease-out ${delay}s infinite` }} />
        ))}
        {/* Cab */}
        <rect x="74" y="10" width="20" height="24" rx="3" fill="url(#rx-trainCab)" />
        <rect x="76" y="12" width="16" height="10" rx="1.5" fill="#1D4ED8" opacity="0.8" />
        <rect x="77" y="13" width="5" height="5" rx="0.8" fill="rgba(255,255,255,0.4)" />
        {/* Cab window glare */}
        <rect x="83" y="13" width="4" height="3" rx="0.5" fill="rgba(255,255,255,0.25)" />
        {/* Front headlight */}
        <ellipse cx="11" cy="22" rx="6" ry="5" fill="#FDE68A"
          filter="url(#rx-trainGlow)"
          style={a ? { animation: 'rx-engine-glow 1.8s ease-in-out infinite' } : {}} />
        <ellipse cx="11" cy="22" rx="3.5" ry="3" fill="#FFFBEB" />
        {/* Cowcatcher */}
        <polygon points="10,30 18,32 10,34" fill="#374151" />
        {/* Coupling rod */}
        <rect x="30" y="37" width="38" height="2" rx="1" fill="#8B5CF6"
          style={a ? { animation: 'rx-bus-ride 0.4s ease-in-out infinite' } : {}} />
        {/* Drive wheels */}
        <TrainWheel cx={35} cy={44} r={9} />
        <TrainWheel cx={55} cy={44} r={9} />
        <TrainWheel cx={75} cy={44} r={9} />
        {/* Bogie wheel (small front) */}
        <g transform="translate(15,44)">
          <circle r="6" fill="#4C1D95" />
          <circle r="4.5" fill="#3B0764" />
          <g style={a ? { animation: 'rx-spin 0.7s linear infinite' } : {}}>
            {[0, 60, 120].map((deg, i) => (
              <line key={i} x1="0" y1="-4" x2="0" y2="4" stroke="#7C3AED" strokeWidth="0.7" transform={`rotate(${deg})`} />
            ))}
          </g>
          <circle r="1.5" fill="#A78BFA" />
        </g>
      </g>
    </svg>
  )
}

// ─── PLANE ICON ──────────────────────────────────────────────────────────────
export function PlaneIcon({ size = 80, animated = true }) {
  useEffect(() => { injectKeyframes() }, [])
  const a = animated
  return (
    <svg viewBox="0 0 110 55" width={size} height={size * 0.5} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="rx-planeFuselage" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E5E7EB" /><stop offset="50%" stopColor="#D1D5DB" /><stop offset="100%" stopColor="#9CA3AF" />
        </linearGradient>
        <linearGradient id="rx-planeWing" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8CDD6" /><stop offset="100%" stopColor="#9CA3AF" />
        </linearGradient>
        <filter id="rx-planeGlow"><feGaussianBlur stdDeviation="1.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>

      <g style={a ? { animation: 'rx-float-plane 2.5s ease-in-out infinite' } : {}}>
        {/* Contrails */}
        {a && [0, 4, 8].map((dy, i) => (
          <line key={i} x1="102" y1={26 + dy - 4} x2="115" y2={26 + dy - 4}
            stroke="rgba(255,255,255,0.35)" strokeWidth="1.2"
            style={{ animation: `rx-trail 1.2s ease-out ${i * 0.3}s infinite`, transformOrigin: '102px 26px' }} />
        ))}

        {/* Main wings */}
        <polygon points="55,26 28,44 25,42 47,26" fill="url(#rx-planeWing)" />
        <polygon points="55,26 28,10 25,12 47,26" fill="url(#rx-planeWing)" />
        {/* Wing shading */}
        <polygon points="47,26 28,44 25,42 42,26" fill="rgba(0,0,0,0.1)" />
        {/* Engine pod under right wing */}
        <ellipse cx="36" cy="39" rx="8" ry="3" fill="#9CA3AF" />
        <ellipse cx="30" cy="39" rx="3.5" ry="2.5" fill="#6B7280" />
        <ellipse cx="42" cy="39" rx="3" ry="2" fill="#6B7280" />

        {/* Fuselage */}
        <ellipse cx="58" cy="26" rx="42" ry="8" fill="url(#rx-planeFuselage)" />
        {/* Belly shading */}
        <ellipse cx="58" cy="30" rx="38" ry="4.5" fill="rgba(0,0,0,0.12)" />
        {/* Cheatline stripe */}
        <path d="M18,24 Q58,22 100,25 L100,27 Q58,24 18,26 Z" fill="#3B82F6" opacity="0.75" />

        {/* Cabin windows */}
        {[30, 40, 50, 60, 70, 80].map((x, i) => (
          <g key={i}>
            <ellipse cx={x} cy="24" rx="3" ry="4" fill="#1D4ED8" opacity="0.7" />
            <ellipse cx={x - 0.5} cy="23" rx="1.2" ry="1.8" fill="rgba(255,255,255,0.4)" />
          </g>
        ))}

        {/* Cockpit */}
        <path d="M18,21 Q10,26 18,31" fill="#1D4ED8" opacity="0.75" />
        <path d="M18,22 Q12,26 18,30" fill="rgba(255,255,255,0.3)" />

        {/* Nose cone */}
        <ellipse cx="14" cy="26" rx="6" ry="5.5" fill="#D1D5DB" />
        {/* Nose beacon */}
        <circle cx="9" cy="26" r="2"
          fill="#ef233c"
          style={a ? { animation: 'rx-engine-glow 1s ease-in-out infinite' } : {}}
          filter="url(#rx-planeGlow)" />

        {/* Vertical tail fin */}
        <polygon points="95,26 88,10 100,10 103,26" fill="url(#rx-planeWing)" />
        <polygon points="95,26 90,12 100,10 103,26" fill="rgba(0,0,0,0.1)" />
        {/* Logo circle on fin */}
        <circle cx="94" cy="17" r="3.5" fill="#ef233c" opacity="0.8" />

        {/* Horizontal stabilizers */}
        <polygon points="98,26 88,33 86,31 95,26" fill="url(#rx-planeWing)" />
        <polygon points="98,26 88,20 86,22 95,26" fill="url(#rx-planeWing)" />

        {/* Tail light */}
        <circle cx="103" cy="26" r="1.5" fill="#22c55e"
          style={a ? { animation: 'rx-engine-glow 1.5s ease-in-out infinite' } : {}} />
      </g>
    </svg>
  )
}

// ─── Generic icon picker ──────────────────────────────────────────────────────
export function TransportIcon({ type, size = 48, animated = true }) {
  if (type === 'bus')    return <BusIcon size={size} animated={animated} />
  if (type === 'train')  return <TrainIcon size={size} animated={animated} />
  if (type === 'flight') return <PlaneIcon size={size} animated={animated} />
  return null
}
