export function CaseVisual({ color = "#E53528", accent = "#0A0A0A" }: { color?: string; accent?: string }) {
  return (
    <svg viewBox="0 0 160 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="10" y="10" width="140" height="260" rx="24" fill={color} opacity="0.08" />
      <rect x="18" y="18" width="124" height="244" rx="20" fill="white" stroke={color} strokeWidth="1.5" />
      <rect x="26" y="26" width="108" height="192" rx="14" fill={accent} opacity="0.04" />
      <circle cx="80" cy="56" r="18" fill={color} opacity="0.12" />
      <circle cx="80" cy="56" r="8" fill={color} opacity="0.3" />
      <rect x="60" y="90" width="40" height="4" rx="2" fill={accent} opacity="0.15" />
      <rect x="50" y="102" width="60" height="3" rx="1.5" fill={accent} opacity="0.1" />
      <rect x="55" y="113" width="50" height="3" rx="1.5" fill={accent} opacity="0.1" />
      <rect x="34" y="140" width="92" height="60" rx="10" fill={color} opacity="0.06" />
      <rect x="42" y="150" width="34" height="34" rx="6" fill={color} opacity="0.12" />
      <rect x="84" y="150" width="34" height="34" rx="6" fill={accent} opacity="0.08" />
      <rect x="140" y="80" width="8" height="50" rx="4" fill={accent} opacity="0.2" />
      <rect x="140" y="140" width="8" height="30" rx="4" fill={accent} opacity="0.2" />
      <rect x="12" y="90" width="8" height="40" rx="4" fill={accent} opacity="0.2" />
    </svg>
  );
}

export function ChargerVisual({ color = "#E53528" }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="30" y="30" width="140" height="140" rx="28" fill={color} opacity="0.08" />
      <rect x="38" y="38" width="124" height="124" rx="22" fill="white" stroke={color} strokeWidth="1.5" />
      <rect x="82" y="158" width="36" height="20" rx="4" fill="#0A0A0A" opacity="0.7" />
      <rect x="88" y="162" width="8" height="12" rx="2" fill="white" />
      <rect x="104" y="162" width="8" height="12" rx="2" fill="white" />
      <path d="M95 80L85 105h25L100 130" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="100" cy="100" r="32" fill={color} opacity="0.08" />
      <text x="100" y="155" textAnchor="middle" fontSize="10" fill="#6B6B6B" fontFamily="Inter">65W GaN</text>
    </svg>
  );
}

export function EarbudsVisual({ color = "#E53528" }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="20" y="50" width="160" height="120" rx="20" fill={color} opacity="0.06" />
      <rect x="28" y="58" width="144" height="104" rx="16" fill="white" stroke={color} strokeWidth="1.2" />
      <ellipse cx="75" cy="110" rx="22" ry="28" fill={color} opacity="0.12" />
      <ellipse cx="125" cy="110" rx="22" ry="28" fill={color} opacity="0.12" />
      <ellipse cx="75" cy="110" rx="14" ry="18" fill={color} opacity="0.2" />
      <ellipse cx="125" cy="110" rx="14" ry="18" fill={color} opacity="0.2" />
      <circle cx="75" cy="110" r="6" fill={color} />
      <circle cx="125" cy="110" r="6" fill={color} />
      <path d="M75 82 Q100 70 125 82" stroke={color} strokeWidth="2" strokeDasharray="4 3" fill="none" opacity="0.4" />
      <text x="100" y="40" textAnchor="middle" fontSize="10" fill="#6B6B6B" fontFamily="Inter">CMF Buds Pro</text>
    </svg>
  );
}

export function CableVisual({ color = "#E53528" }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="10" y="55" width="30" height="50" rx="8" fill={color} opacity="0.15" />
      <rect x="18" y="68" width="14" height="24" rx="3" fill="#0A0A0A" opacity="0.6" />
      <path d="M40 80 Q70 60 100 80 Q130 100 160 80" stroke={color} strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M40 80 Q70 60 100 80 Q130 100 160 80" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />
      <rect x="160" y="55" width="30" height="50" rx="8" fill={color} opacity="0.15" />
      <rect x="168" y="68" width="14" height="24" rx="3" fill="#0A0A0A" opacity="0.6" />
      <text x="100" y="130" textAnchor="middle" fontSize="10" fill="#6B6B6B" fontFamily="Inter">USB-C Braided</text>
    </svg>
  );
}

export function PowerBankVisual({ color = "#E53528" }: { color?: string }) {
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="20" y="30" width="200" height="100" rx="20" fill={color} opacity="0.08" />
      <rect x="28" y="38" width="184" height="84" rx="16" fill="white" stroke={color} strokeWidth="1.5" />
      <rect x="218" y="68" width="16" height="24" rx="4" fill={color} opacity="0.2" />
      <rect x="40" y="58" width="100" height="24" rx="8" fill="#F0F0EE" />
      <rect x="42" y="60" width="56" height="20" rx="6" fill={color} opacity="0.25" />
      <text x="90" y="74" textAnchor="middle" fontSize="9" fill={color} fontFamily="Inter" fontWeight="600">56%</text>
      <circle cx="160" cy="70" r="14" fill={color} opacity="0.1" />
      <path d="M160 60l-6 14h10l-8 16" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="120" y="110" textAnchor="middle" fontSize="10" fill="#6B6B6B" fontFamily="Inter">10,000mAh • 45W</text>
    </svg>
  );
}

export function PhoneNothingVisual({ model = "2" }: { model?: string }) {
  return (
    <svg viewBox="0 0 180 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="10" y="10" width="160" height="340" rx="30" fill="#0A0A0A" />
      <rect x="16" y="16" width="148" height="328" rx="26" fill="#1A1A1A" />
      <rect x="22" y="22" width="136" height="316" rx="22" fill="#111" />
      {/* Glyph pattern - Nothing signature */}
      <rect x="30" y="60" width="120" height="200" rx="10" fill="#222" />
      <line x1="60" y1="80" x2="60" y2="240" stroke="#E53528" strokeWidth="1" opacity="0.6" />
      <line x1="90" y1="80" x2="90" y2="240" stroke="#E53528" strokeWidth="1" opacity="0.6" />
      <line x1="120" y1="80" x2="120" y2="240" stroke="#E53528" strokeWidth="1" opacity="0.6" />
      <line x1="30" y1="110" x2="150" y2="110" stroke="#E53528" strokeWidth="1" opacity="0.6" />
      <line x1="30" y1="160" x2="150" y2="160" stroke="#E53528" strokeWidth="1" opacity="0.6" />
      <line x1="30" y1="210" x2="150" y2="210" stroke="#E53528" strokeWidth="1" opacity="0.6" />
      <circle cx="90" cy="160" r="28" fill="#E53528" opacity="0.15" />
      <circle cx="90" cy="160" r="16" fill="#E53528" opacity="0.25" />
      <circle cx="90" cy="160" r="6" fill="#E53528" />
      <text x="90" y="298" textAnchor="middle" fontSize="11" fill="#666" fontFamily="Inter">Phone ({model})</text>
    </svg>
  );
}

export function NothingPixelMark({ size = 24, color = "#E53528" }: { size?: number; color?: string }) {
  const pixels = [
    [1,0],[2,0],[3,0],
    [0,1],[4,1],
    [0,2],[1,2],[2,2],[3,2],[4,2],
    [0,3],[2,3],[4,3],
    [1,4],[2,4],[3,4],
  ];
  const cellSize = size / 5;
  return (
    <svg width={size} height={size} viewBox="0 0 5 5" fill="none">
      {pixels.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={0.85} height={0.85} rx={0.15} fill={color} />
      ))}
    </svg>
  );
}
