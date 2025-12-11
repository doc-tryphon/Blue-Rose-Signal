import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Icon generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#111111',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Pixelated inverted triangle using grid of rectangles */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background */}
          <rect width="32" height="32" fill="#111111" />

          {/* Pixelated inverted triangle (The Board reference) */}
          {/* Row 1 - top (widest) */}
          <rect x="4" y="6" width="3" height="3" fill="#FFCC00" />
          <rect x="7" y="6" width="3" height="3" fill="#FFCC00" />
          <rect x="10" y="6" width="3" height="3" fill="#FFCC00" />
          <rect x="13" y="6" width="3" height="3" fill="#FFCC00" />
          <rect x="16" y="6" width="3" height="3" fill="#FFCC00" />
          <rect x="19" y="6" width="3" height="3" fill="#FFCC00" />
          <rect x="22" y="6" width="3" height="3" fill="#FFCC00" />
          <rect x="25" y="6" width="3" height="3" fill="#FFCC00" />

          {/* Row 2 */}
          <rect x="7" y="9" width="3" height="3" fill="#FFCC00" />
          <rect x="10" y="9" width="3" height="3" fill="#FFCC00" />
          <rect x="13" y="9" width="3" height="3" fill="#FFCC00" />
          <rect x="16" y="9" width="3" height="3" fill="#FFCC00" />
          <rect x="19" y="9" width="3" height="3" fill="#FFCC00" />
          <rect x="22" y="9" width="3" height="3" fill="#FFCC00" />

          {/* Row 3 */}
          <rect x="10" y="12" width="3" height="3" fill="#FFCC00" />
          <rect x="13" y="12" width="3" height="3" fill="#FFCC00" />
          <rect x="16" y="12" width="3" height="3" fill="#FFCC00" />
          <rect x="19" y="12" width="3" height="3" fill="#FFCC00" />

          {/* Row 4 */}
          <rect x="10" y="15" width="3" height="3" fill="#FFCC00" />
          <rect x="13" y="15" width="3" height="3" fill="#FFCC00" />
          <rect x="16" y="15" width="3" height="3" fill="#FFCC00" />
          <rect x="19" y="15" width="3" height="3" fill="#FFCC00" />

          {/* Row 5 */}
          <rect x="13" y="18" width="3" height="3" fill="#FFCC00" />
          <rect x="16" y="18" width="3" height="3" fill="#FFCC00" />

          {/* Row 6 */}
          <rect x="13" y="21" width="3" height="3" fill="#FFCC00" />
          <rect x="16" y="21" width="3" height="3" fill="#FFCC00" />

          {/* Row 7 - point */}
          <rect x="16" y="24" width="3" height="3" fill="#FFCC00" />

          {/* Subtle glow effect - outer border */}
          <rect x="4" y="6" width="3" height="3" fill="#FFCC00" opacity="0.3" />
          <rect x="25" y="6" width="3" height="3" fill="#FFCC00" opacity="0.3" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
