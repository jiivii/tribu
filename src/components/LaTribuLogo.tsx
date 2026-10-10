import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  textColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const LaTribuLogo: React.FC<LogoProps> = ({
  className = '',
  showText = true,
  textColor = '#707A63',
  size = 'md'
}) => {
  const dimensions = {
    sm: { width: 36, height: 36, textSize: 'text-lg' },
    md: { width: 48, height: 48, textSize: 'text-xl' },
    lg: { width: 72, height: 72, textSize: 'text-2xl' },
    xl: { width: 110, height: 110, textSize: 'text-4xl' }
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform hover:scale-105 duration-300"
        aria-label="Logo La Tribu"
      >
        {/* Outer Rainbow Arch: Sage Green #9AA08A */}
        <path
          d="M 35 125 A 65 65 0 0 1 165 125"
          fill="none"
          stroke="#9AA08A"
          strokeWidth="15"
          strokeLinecap="round"
        />

        {/* Middle Rainbow Arch: Mustard Honey Yellow #F1BF70 */}
        <path
          d="M 52 125 A 48 48 0 0 1 148 125"
          fill="none"
          stroke="#F1BF70"
          strokeWidth="13"
          strokeLinecap="round"
        />

        {/* Inner Rainbow Arch: Dusty Blush Pink #DFAEA1 */}
        <path
          d="M 68 125 A 32 32 0 0 1 132 125"
          fill="none"
          stroke="#DFAEA1"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Family Figures in center */}
        {/* Figure 1 (Left - Adult Sage): Head & Body */}
        <circle cx="82" cy="98" r="8.5" fill="#9AA08A" />
        <path
          d="M 72 130 C 72 113 92 113 92 130 Z"
          fill="#9AA08A"
        />

        {/* Figure 2 (Center - Child Honey): Head & Body */}
        <circle cx="100" cy="107" r="6" fill="#F1BF70" />
        <path
          d="M 91 130 C 91 117 109 117 109 130 Z"
          fill="#F1BF70"
        />

        {/* Figure 3 (Right - Adult Blush Pink): Head & Body */}
        <circle cx="118" cy="98" r="8.5" fill="#DFAEA1" />
        <path
          d="M 108 130 C 108 113 128 113 128 130 Z"
          fill="#DFAEA1"
        />

        {/* Wooden Cradle Base #C39D70 */}
        <path
          d="M 45 124 C 65 146 135 146 155 124 C 145 138 55 138 45 124 Z"
          fill="#C39D70"
        />
        {/* Top lip of wooden beam */}
        <path
          d="M 45 124 C 60 134 140 134 155 124 C 153 129 47 129 45 124 Z"
          fill="#B58D60"
        />

        {/* Delicate leaves on bottom corners */}
        <path
          d="M 37 132 C 34 144 46 148 53 140 C 53 132 43 128 37 132 Z"
          fill="#9AA08A"
          opacity="0.85"
        />
        <path
          d="M 163 132 C 166 144 154 148 147 140 C 147 132 157 128 163 132 Z"
          fill="#9AA08A"
          opacity="0.85"
        />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-extrabold tracking-wider font-heading uppercase ${dimensions.textSize}`}
            style={{ color: textColor }}
          >
            LA TRIBU
          </span>
          {size !== 'sm' && (
            <span className="text-[11px] font-semibold text-[#707A63]/80 tracking-wide mt-0.5">
              Espacio para celebraciones
            </span>
          )}
        </div>
      )}
    </div>
  );
};
