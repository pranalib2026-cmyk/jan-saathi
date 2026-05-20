import "./globals.css";

export const metadata = {
  title: "Jan Saathi — Find Every Government Benefit You Deserve",
  description: "AI-powered welfare navigator for Indian citizens. Find government schemes you qualify for, get step-by-step application guides, and claim your benefits — in your language.",
  keywords: "government schemes, welfare, PM-KISAN, Ayushman Bharat, MGNREGA, India, benefits",
  openGraph: {
    title: "Jan Saathi — Your Personal Welfare Navigator",
    description: "Find every government benefit you deserve — in minutes",
    type: "website",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0c0c0c',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0c0c0c" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-[#0c0c0c] text-white antialiased">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover pointer-events-none"
            style={{ opacity: 0.2 }}
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4"
          />
        </div>
        <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%+36rem)] w-px bg-white/10 z-[5]" />
        <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%+36rem)] w-px bg-white/10 z-[5]" />
        <svg className="absolute w-0 h-0" aria-hidden="true" focusable="false">
          <filter id="c3-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
            <feComposite in2="SourceGraphic" operator="in" result="noise" />
            <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
          </filter>
        </svg>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
