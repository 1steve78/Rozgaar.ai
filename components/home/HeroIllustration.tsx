export default function HeroIllustration() {
  return (
    <div className="relative w-full h-[450px]">
      <svg
        viewBox="0 0 700 450"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>

        {/* Network connection lines */}
        <g opacity="0.4" stroke="white" strokeWidth="2" fill="none">
          <line x1="150" y1="80" x2="350" y2="120" />
          <line x1="350" y1="120" x2="550" y2="90" />
          <line x1="200" y1="250" x2="400" y2="200" />
          <line x1="400" y1="200" x2="520" y2="240" />
          <line x1="350" y1="120" x2="400" y2="200" />
        </g>

        {/* Connection nodes */}
        <g fill="white">
          <circle cx="150" cy="80" r="6" opacity="0.9" />
          <circle cx="350" cy="120" r="6" opacity="0.9" />
          <circle cx="550" cy="90" r="6" opacity="0.9" />
          <circle cx="520" cy="240" r="6" opacity="0.9" />
          <circle cx="200" cy="250" r="6" opacity="0.9" />
        </g>

        {/* Main platform/dashboard */}
        <g>
          <rect x="250" y="180" width="200" height="140" rx="12" fill="white" opacity="0.95" />
          
          {/* Dashboard elements */}
          <rect x="270" y="205" width="60" height="35" rx="6" fill="url(#blueGradient)" />
          <rect x="340" y="210" width="90" height="10" rx="5" fill="#E5E7EB" />
          <rect x="340" y="225" width="70" height="10" rx="5" fill="#E5E7EB" />
          
          <rect x="270" y="255" width="160" height="8" rx="4" fill="#F3F4F6" />
          <rect x="270" y="270" width="130" height="8" rx="4" fill="#F3F4F6" />
          <rect x="270" y="285" width="100" height="8" rx="4" fill="#F3F4F6" />
        </g>

        {/* Isometric boxes - Blue */}
        <g>
          {/* Box 1 - Bottom left */}
          <path d="M100,320 L140,300 L140,260 L100,280 Z" fill="#3B82F6" />
          <path d="M140,300 L180,320 L180,280 L140,260 Z" fill="#2563EB" />
          <path d="M100,320 L140,340 L180,320 L140,300 Z" fill="#60A5FA" />
          
          {/* Box 2 - Small left */}
          <path d="M80,200 L105,185 L105,160 L80,175 Z" fill="#3B82F6" />
          <path d="M105,185 L130,200 L130,175 L105,160 Z" fill="#2563EB" />
          <path d="M80,200 L105,215 L130,200 L105,185 Z" fill="#60A5FA" />
        </g>

        {/* Isometric boxes - Purple */}
        <g>
          {/* Box 3 - Right side */}
          <path d="M500,300 L540,280 L540,240 L500,260 Z" fill="#A78BFA" />
          <path d="M540,280 L580,300 L580,260 L540,240 Z" fill="#8B5CF6" />
          <path d="M500,300 L540,320 L580,300 L540,280 Z" fill="#C4B5FD" />
          
          {/* Box 4 - Small right top */}
          <path d="M580,160 L610,145 L610,115 L580,130 Z" fill="#A78BFA" />
          <path d="M610,145 L640,160 L640,130 L610,115 Z" fill="#8B5CF6" />
          <path d="M580,160 L610,175 L640,160 L610,145 Z" fill="#C4B5FD" />
        </g>

        {/* Person 1 - Left with laptop */}
        <g transform="translate(180, 140)">
          <circle cx="0" cy="0" r="22" fill="white" />
          <ellipse cx="0" cy="8" rx="3" ry="4" fill="#1F2937" />
          <ellipse cx="10" cy="8" rx="3" ry="4" fill="#1F2937" />
          <path d="M -5,18 Q 5,20 15,18" stroke="#1F2937" strokeWidth="2" fill="none" />
          <rect x="-18" y="25" width="36" height="55" rx="8" fill="white" />
          <rect x="-15" y="30" width="30" height="20" rx="4" fill="#3B82F6" />
          <rect x="-10" y="55" width="20" height="3" rx="1.5" fill="#E5E7EB" />
          <rect x="-10" y="62" width="20" height="3" rx="1.5" fill="#E5E7EB" />
        </g>

        {/* Person 2 - Right presenting */}
        <g transform="translate(520, 170)">
          <circle cx="0" cy="0" r="20" fill="white" />
          <ellipse cx="-5" cy="5" rx="3" ry="4" fill="#1F2937" />
          <ellipse cx="5" cy="5" rx="3" ry="4" fill="#1F2937" />
          <path d="M -4,15 Q 0,17 4,15" stroke="#1F2937" strokeWidth="2" fill="none" />
          <rect x="-16" y="23" width="32" height="50" rx="8" fill="white" />
          <line x1="-16" y1="30" x2="-30" y2="20" stroke="white" strokeWidth="6" strokeLinecap="round" />
          <line x1="16" y1="35" x2="35" y2="30" stroke="white" strokeWidth="6" strokeLinecap="round" />
        </g>

        {/* Person 3 - Bottom right */}
        <g transform="translate(450, 310)">
          <circle cx="0" cy="0" r="18" fill="white" />
          <ellipse cx="-4" cy="5" rx="2.5" ry="3" fill="#1F2937" />
          <ellipse cx="4" cy="5" rx="2.5" ry="3" fill="#1F2937" />
          <path d="M -3,13 Q 0,15 3,13" stroke="#1F2937" strokeWidth="1.5" fill="none" />
          <rect x="-14" y="20" width="28" height="45" rx="7" fill="white" />
        </g>

        {/* Email/Message icon - Top right */}
        <g transform="translate(560, 70)">
          <rect x="0" y="0" width="50" height="35" rx="4" fill="white" opacity="0.95" />
          <path d="M 0,0 L 25,20 L 50,0" fill="none" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="0" y1="0" x2="0" y2="35" stroke="white" strokeWidth="2" />
          <line x1="50" y1="0" x2="50" y2="35" stroke="white" strokeWidth="2" />
        </g>

        {/* Analytics chart - Bottom left */}
        <g transform="translate(60, 360)">
          <rect x="0" y="35" width="12" height="25" rx="2" fill="#3B82F6" opacity="0.9" />
          <rect x="18" y="25" width="12" height="35" rx="2" fill="#3B82F6" opacity="0.9" />
          <rect x="36" y="15" width="12" height="45" rx="2" fill="#8B5CF6" opacity="0.9" />
          <rect x="54" y="20" width="12" height="40" rx="2" fill="#A78BFA" opacity="0.9" />
        </g>

        {/* Decorative elements */}
        <g opacity="0.6">
          <circle cx="620" cy="200" r="4" fill="white" />
          <circle cx="100" cy="100" r="3" fill="white" />
          <circle cx="650" cy="350" r="5" fill="white" />
          
          {/* Triangles */}
          <path d="M 150,350 L 160,330 L 140,330 Z" fill="#8B5CF6" opacity="0.7" />
          <path d="M 600,280 L 610,300 L 620,280 Z" fill="#3B82F6" opacity="0.7" />
        </g>

        {/* "AI" text badge */}
        <g transform="translate(380, 140)">
          <rect x="0" y="0" width="40" height="25" rx="12" fill="url(#blueGradient)" />
          <text x="20" y="17" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
            AI
          </text>
        </g>
      </svg>
    </div>
  );
}