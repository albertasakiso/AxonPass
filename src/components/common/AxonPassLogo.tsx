import React from 'react';

interface AxonPassLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export const AxonPassLogo: React.FC<AxonPassLogoProps> = ({
  size = 32,
  className = '',
  showText = false,
  textClassName = '',
}) => {
  return (
    <div
      className={`axonpass-logo-wrap ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, borderRadius: '22%' }}
      >
        <defs>
          <radialGradient id="logoBg" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="60%" stopColor="#0B0F19" />
            <stop offset="100%" stopColor="#030712" />
          </radialGradient>
          <linearGradient id="logoShieldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="40%" stopColor="#2563EB" />
            <stop offset="70%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <radialGradient id="logoCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="1" />
            <stop offset="40%" stopColor="#06B6D4" stopOpacity="0.8" />
            <stop offset="80%" stopColor="#2563EB" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Rounded Plate */}
        <rect width="512" height="512" rx="112" fill="url(#logoBg)" stroke="#1E293B" strokeWidth="6" />

        {/* Shield Border */}
        <path
          d="M 256 70 C 340 70, 396 92, 408 122 C 408 248, 362 368, 256 438 C 150 368, 104 248, 104 122 C 116 92, 172 70, 256 70 Z"
          fill="#0B132B"
          stroke="url(#logoShieldBorder)"
          strokeWidth="16"
          strokeLinejoin="round"
        />

        {/* Inner Accent Path */}
        <path
          d="M 256 94 C 324 94, 368 112, 378 134 C 378 232, 342 334, 256 398 C 170 334, 134 232, 134 134 C 144 112, 188 94, 256 94 Z"
          fill="#080F20"
          stroke="#0284C7"
          strokeWidth="3"
          opacity="0.6"
        />

        {/* Axon Synapse Network */}
        <path
          d="M 256 240 L 256 140 M 256 180 L 220 145 M 256 180 L 292 145 M 275 235 L 345 170 M 310 200 L 340 215 M 285 256 L 365 256 M 330 256 L 355 235 M 330 256 L 355 277 M 275 275 L 340 335 M 305 305 L 338 295 M 256 285 L 256 375 M 256 330 L 230 355 M 256 330 L 282 355 M 237 275 L 172 335 M 207 305 L 174 295 M 227 256 L 147 256 M 182 256 L 157 235 M 182 256 L 157 277 M 242 235 L 167 170 M 202 200 L 172 215"
          stroke="#38BDF8"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Synapse Connection Nodes */}
        <circle cx="256" cy="140" r="7" fill="#38BDF8" />
        <circle cx="220" cy="145" r="5" fill="#67E8F9" />
        <circle cx="292" cy="145" r="5" fill="#67E8F9" />
        <circle cx="345" cy="170" r="7" fill="#38BDF8" />
        <circle cx="365" cy="256" r="7" fill="#38BDF8" />
        <circle cx="355" cy="235" r="5" fill="#67E8F9" />
        <circle cx="355" cy="277" r="5" fill="#67E8F9" />
        <circle cx="340" cy="335" r="7" fill="#38BDF8" />
        <circle cx="256" cy="375" r="7" fill="#38BDF8" />
        <circle cx="230" cy="355" r="5" fill="#67E8F9" />
        <circle cx="282" cy="355" r="5" fill="#67E8F9" />
        <circle cx="172" cy="335" r="7" fill="#38BDF8" />
        <circle cx="147" cy="256" r="7" fill="#38BDF8" />
        <circle cx="157" cy="235" r="5" fill="#67E8F9" />
        <circle cx="157" cy="277" r="5" fill="#67E8F9" />
        <circle cx="167" cy="170" r="7" fill="#38BDF8" />

        {/* Glowing Center Core */}
        <circle cx="256" cy="256" r="68" fill="url(#logoCore)" />
        <circle cx="256" cy="256" r="44" fill="#0B132B" stroke="#00F0FF" strokeWidth="4" />
        <ellipse cx="256" cy="256" rx="32" ry="12" fill="none" stroke="#38BDF8" strokeWidth="2.5" transform="rotate(-30 256 256)" />
        <ellipse cx="256" cy="256" rx="32" ry="12" fill="none" stroke="#22D3EE" strokeWidth="2.5" transform="rotate(30 256 256)" />
        <circle cx="256" cy="256" r="14" fill="#FFFFFF" />
        <circle cx="256" cy="256" r="7" fill="#00F0FF" />
      </svg>

      {showText && (
        <span
          className={`axonpass-brand-text ${textClassName}`}
          style={{
            fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            fontSize: typeof size === 'number' ? `${Math.round(size * 0.65)}px` : '1.25rem',
            background: 'linear-gradient(135deg, #FFFFFF 30%, #38BDF8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
          }}
        >
          AxonPass
        </span>
      )}
    </div>
  );
};

export default AxonPassLogo;
