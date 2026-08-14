import React from 'react';

// Login & Signup Illustration: Stack of books, ladder, globe, laptop dashboard, pencil
export const AuthIllustrationLogin = () => (
  <svg className="w-full h-auto max-w-[420px] max-h-[380px] mx-auto drop-shadow-xl" viewBox="0 0 500 450" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background Shadow */}
    <ellipse cx="250" cy="380" rx="190" ry="24" fill="#E2E8F0" opacity="0.7" />

    {/* Globe */}
    <g transform="translate(140, 60)">
      <circle cx="45" cy="45" r="38" fill="url(#globeGrad)" />
      <path d="M 15 45 Q 45 25 75 45 Q 45 65 15 45 Z" stroke="#38BDF8" strokeWidth="2.5" fill="none" opacity="0.8" />
      <path d="M 45 7 Q 62 45 45 83 Q 28 45 45 7 Z" stroke="#38BDF8" strokeWidth="2.5" fill="none" opacity="0.8" />
      <circle cx="45" cy="45" r="38" stroke="#0284C7" strokeWidth="3" fill="none" />
      {/* Globe Stand */}
      <path d="M 45 83 L 45 105 M 25 105 L 65 105" stroke="#1D4ED8" strokeWidth="5" strokeLinecap="round" />
    </g>

    {/* Reports / Dashboard Card in Background */}
    <g transform="translate(260, 40)">
      <rect x="0" y="0" width="140" height="95" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" filter="drop-shadow(0px 8px 16px rgba(15,23,42,0.08))" />
      <rect x="15" y="15" width="50" height="8" rx="4" fill="#2563EB" />
      <rect x="15" y="32" width="110" height="5" rx="2.5" fill="#E2E8F0" />
      <rect x="15" y="44" width="90" height="5" rx="2.5" fill="#E2E8F0" />
      {/* Bar chart inside dashboard */}
      <rect x="20" y="75" width="12" height="-15" rx="3" fill="#38BDF8" />
      <rect x="38" y="75" width="12" height="-26" rx="3" fill="#2563EB" />
      <rect x="56" y="75" width="12" height="-38" rx="3" fill="#34D399" />
      <rect x="74" y="75" width="12" height="-20" rx="3" fill="#1D4ED8" />
    </g>

    {/* Stack of Isometric Books */}
    {/* Bottom Book (Deep Blue) */}
    <g transform="translate(150, 260)">
      <path d="M 0 35 L 140 70 L 250 20 L 110 -15 Z" fill="#1D4ED8" />
      <path d="M 0 35 L 0 52 L 140 87 L 140 70 Z" fill="#1E40AF" />
      <path d="M 140 87 L 250 37 L 250 20 L 140 70 Z" fill="#E2E8F0" />
      <path d="M 145 74 L 245 28 L 245 32 L 145 78 Z" fill="#CBD5E1" />
    </g>

    {/* Middle Book (Purple / Royal Blue) */}
    <g transform="translate(165, 220)">
      <path d="M 0 35 L 130 65 L 230 20 L 100 -10 Z" fill="#4F46E5" />
      <path d="M 0 35 L 0 50 L 130 80 L 130 65 Z" fill="#3730A3" />
      <path d="M 130 80 L 230 35 L 230 20 L 130 65 Z" fill="#FFFFFF" />
      <path d="M 135 69 L 225 28 L 225 32 L 135 73 Z" fill="#E2E8F0" />
    </g>

    {/* Top Book (Vibrant Blue) */}
    <g transform="translate(180, 180)">
      <path d="M 0 35 L 120 60 L 210 20 L 90 -10 Z" fill="#2563EB" />
      <path d="M 0 35 L 0 48 L 120 73 L 120 60 Z" fill="#1D4ED8" />
      <path d="M 120 73 L 210 33 L 210 20 L 120 60 Z" fill="#F8FAFC" />
      <path d="M 125 64 L 205 28 L 205 31 L 125 67 Z" fill="#CBD5E1" />
    </g>

    {/* Ladder Leaning on Books */}
    <g transform="translate(230, 140)">
      <path d="M 30 0 L 80 180" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
      <path d="M 45 0 L 95 180" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
      {/* Rungs */}
      <line x1="34" y1="20" x2="49" y2="20" stroke="#F59E0B" strokeWidth="4" />
      <line x1="42" y1="50" x2="57" y2="50" stroke="#F59E0B" strokeWidth="4" />
      <line x1="50" y1="80" x2="65" y2="80" stroke="#F59E0B" strokeWidth="4" />
      <line x1="58" y1="110" x2="73" y2="110" stroke="#F59E0B" strokeWidth="4" />
      <line x1="66" y1="140" x2="81" y2="140" stroke="#F59E0B" strokeWidth="4" />
      <line x1="74" y1="170" x2="89" y2="170" stroke="#F59E0B" strokeWidth="4" />
    </g>

    {/* Graduation Cap on top of books */}
    <g transform="translate(240, 120)">
      <polygon points="40,0 80,18 40,36 0,18" fill="#0F172A" />
      <polygon points="40,36 80,18 80,24 40,42" fill="#1E293B" />
      <polygon points="0,18 40,36 40,42 0,24" fill="#334155" />
      {/* Tassel */}
      <path d="M 40 18 L 15 28 L 15 42" stroke="#34D399" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="15" cy="44" r="3" fill="#34D399" />
    </g>

    {/* Calculator beside books */}
    <g transform="translate(380, 280)">
      <rect x="0" y="0" width="70" height="95" rx="10" fill="#0F172A" transform="skewY(-15)" />
      <rect x="8" y="10" width="54" height="20" rx="4" fill="#34D399" transform="skewY(-15)" />
      {/* Buttons */}
      <circle cx="16" cy="45" r="4" fill="#38BDF8" />
      <circle cx="35" cy="40" r="4" fill="#94A3B8" />
      <circle cx="54" cy="35" r="4" fill="#94A3B8" />
      <circle cx="16" cy="60" r="4" fill="#94A3B8" />
      <circle cx="35" cy="55" r="4" fill="#94A3B8" />
      <circle cx="54" cy="50" r="4" fill="#34D399" />
      <circle cx="16" cy="75" r="4" fill="#94A3B8" />
      <circle cx="35" cy="70" r="4" fill="#94A3B8" />
      <circle cx="54" cy="65" r="4" fill="#38BDF8" />
    </g>

    {/* Pencil */}
    <g transform="translate(130, 310) rotate(-35)">
      <rect x="0" y="0" width="90" height="12" rx="2" fill="#F59E0B" />
      <polygon points="90,0 110,6 90,12" fill="#FDE68A" />
      <polygon points="104,4 110,6 104,8" fill="#1E293B" />
      <rect x="-10" y="0" width="10" height="12" rx="2" fill="#F43F5E" />
    </g>

    {/* Gradients */}
    <defs>
      <linearGradient id="globeGrad" x1="0" y1="0" x2="90" y2="90">
        <stop offset="0%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
    </defs>
  </svg>
);

// Register Illustration: Stack of books, diploma, laptop, cap
export const AuthIllustrationRegister = () => (
  <svg className="w-full h-auto max-w-[420px] max-h-[380px] mx-auto drop-shadow-xl" viewBox="0 0 500 450" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Base shadow */}
    <ellipse cx="250" cy="380" rx="190" ry="24" fill="#E2E8F0" opacity="0.7" />

    {/* Globe */}
    <g transform="translate(320, 60)">
      <circle cx="45" cy="45" r="36" fill="url(#regGlobeGrad)" />
      <path d="M 15 45 Q 45 25 75 45 Q 45 65 15 45 Z" stroke="#38BDF8" strokeWidth="2.5" fill="none" opacity="0.8" />
      <circle cx="45" cy="45" r="36" stroke="#0284C7" strokeWidth="3" fill="none" />
      <path d="M 45 81 L 45 100 M 28 100 L 62 100" stroke="#1D4ED8" strokeWidth="4.5" strokeLinecap="round" />
    </g>

    {/* Laptop */}
    <g transform="translate(100, 70)">
      <rect x="0" y="0" width="150" height="100" rx="10" fill="#1E293B" />
      <rect x="8" y="8" width="134" height="84" rx="6" fill="#38BDF8" opacity="0.9" />
      {/* Code lines */}
      <rect x="20" y="24" width="70" height="6" rx="3" fill="#FFFFFF" />
      <rect x="20" y="38" width="100" height="6" rx="3" fill="#34D399" />
      <rect x="20" y="52" width="50" height="6" rx="3" fill="#FFFFFF" opacity="0.8" />
      <rect x="20" y="66" width="85" height="6" rx="3" fill="#F59E0B" />
      {/* Laptop Keyboard base */}
      <path d="M -15 100 L 165 100 L 180 115 L -30 115 Z" fill="#94A3B8" />
    </g>

    {/* Stack of Isometric Books */}
    <g transform="translate(160, 250)">
      <path d="M 0 35 L 140 70 L 250 20 L 110 -15 Z" fill="#1D4ED8" />
      <path d="M 0 35 L 0 52 L 140 87 L 140 70 Z" fill="#1E40AF" />
      <path d="M 140 87 L 250 37 L 250 20 L 140 70 Z" fill="#E2E8F0" />
    </g>
    <g transform="translate(175, 210)">
      <path d="M 0 35 L 130 65 L 230 20 L 100 -10 Z" fill="#34D399" />
      <path d="M 0 35 L 0 50 L 130 80 L 130 65 Z" fill="#059669" />
      <path d="M 130 80 L 230 35 L 230 20 L 130 65 Z" fill="#FFFFFF" />
    </g>
    <g transform="translate(190, 170)">
      <path d="M 0 35 L 120 60 L 210 20 L 90 -10 Z" fill="#2563EB" />
      <path d="M 0 35 L 0 48 L 120 73 L 120 60 Z" fill="#1D4ED8" />
      <path d="M 120 73 L 210 33 L 210 20 L 120 60 Z" fill="#F8FAFC" />
    </g>

    {/* Diploma Roll */}
    <g transform="translate(110, 310) rotate(-15)">
      <rect x="0" y="0" width="110" height="24" rx="12" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
      <rect x="45" y="-2" width="20" height="28" rx="4" fill="#EF4444" />
      <ellipse cx="0" cy="12" rx="5" ry="12" fill="#E2E8F0" />
    </g>

    {/* Graduation Cap */}
    <g transform="translate(250, 110)">
      <polygon points="40,0 80,18 40,36 0,18" fill="#0F172A" />
      <polygon points="40,36 80,18 80,24 40,42" fill="#1E293B" />
      <polygon points="0,18 40,36 40,42 0,24" fill="#334155" />
      <path d="M 40 18 L 15 28 L 15 42" stroke="#34D399" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="15" cy="44" r="3" fill="#34D399" />
    </g>

    <defs>
      <linearGradient id="regGlobeGrad" x1="0" y1="0" x2="80" y2="80">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
    </defs>
  </svg>
);

// Forgot Password Illustration: Laptop screen with envelope, paper plane, big 3D padlock
export const AuthIllustrationForgot = () => (
  <svg className="w-full h-auto max-w-[400px] max-h-[360px] mx-auto drop-shadow-xl" viewBox="0 0 480 420" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="240" cy="360" rx="170" ry="20" fill="#E2E8F0" opacity="0.7" />

    {/* Laptop Base & Screen */}
    <g transform="translate(100, 160)">
      <rect x="0" y="0" width="220" height="145" rx="14" fill="#0F172A" />
      <rect x="10" y="10" width="200" height="125" rx="8" fill="#E0F2FE" />
      {/* Laptop Base */}
      <path d="M -25 145 L 245 145 L 265 165 L -45 165 Z" fill="#94A3B8" />
      <rect x="90" y="148" width="40" height="4" rx="2" fill="#64748B" />
    </g>

    {/* Big 3D Padlock */}
    <g transform="translate(200, 80)">
      {/* Shackle */}
      <path d="M 30 50 L 30 25 C 30 10, 70 10, 70 25 L 70 50" stroke="#2563EB" strokeWidth="16" strokeLinecap="round" fill="none" />
      <path d="M 30 50 L 30 25 C 30 10, 70 10, 70 25 L 70 50" stroke="#38BDF8" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* Body */}
      <rect x="10" y="45" width="80" height="75" rx="16" fill="#1D4ED8" filter="drop-shadow(0px 10px 20px rgba(29,78,216,0.3))" />
      <rect x="15" y="50" width="70" height="65" rx="12" fill="#2563EB" />
      {/* Keyhole */}
      <circle cx="50" cy="78" r="10" fill="#FFFFFF" />
      <polygon points="45,80 55,80 53,100 47,100" fill="#FFFFFF" />
      <circle cx="50" cy="78" r="5" fill="#0F172A" />
    </g>

    {/* Envelope floating out */}
    <g transform="translate(130, 200) rotate(-10)">
      <rect x="0" y="0" width="110" height="70" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" filter="drop-shadow(0px 8px 16px rgba(0,0,0,0.1))" />
      <path d="M 0 0 L 55 40 L 110 0" stroke="#38BDF8" strokeWidth="3" fill="none" />
      <circle cx="55" cy="40" r="12" fill="#34D399" />
      <path d="M 50 40 L 54 44 L 62 36" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>

    {/* Paper Airplane */}
    <g transform="translate(340, 120) rotate(15)">
      <path d="M 0 20 L 50 0 L 25 40 L 20 25 Z" fill="#38BDF8" />
      <path d="M 50 0 L 20 25 L 50 20 Z" fill="#2563EB" />
    </g>

    {/* Dashed flight trail */}
    <path d="M 230 220 C 280 200, 310 160, 340 135" stroke="#94A3B8" strokeWidth="2.5" strokeDasharray="6 6" fill="none" />
  </svg>
);

// Reset Password Illustration: Keyboard/tablet, 3D key, green lock shield
export const AuthIllustrationReset = () => (
  <svg className="w-full h-auto max-w-[400px] max-h-[360px] mx-auto drop-shadow-xl" viewBox="0 0 480 420" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="240" cy="360" rx="170" ry="20" fill="#E2E8F0" opacity="0.7" />

    {/* Keyboard / Tablet Surface */}
    <g transform="translate(100, 200)">
      <polygon points="120,0 320,0 240,110 40,110" fill="#1E293B" />
      <polygon points="125,5 315,5 238,105 47,105" fill="#334155" />
      {/* Key rows */}
      <rect x="70" y="20" width="20" height="12" rx="3" fill="#64748B" />
      <rect x="100" y="20" width="20" height="12" rx="3" fill="#64748B" />
      <rect x="130" y="20" width="20" height="12" rx="3" fill="#64748B" />
      <rect x="160" y="20" width="20" height="12" rx="3" fill="#64748B" />
      <rect x="190" y="20" width="20" height="12" rx="3" fill="#34D399" />

      <rect x="80" y="45" width="22" height="12" rx="3" fill="#64748B" />
      <rect x="110" y="45" width="22" height="12" rx="3" fill="#38BDF8" />
      <rect x="140" y="45" width="22" height="12" rx="3" fill="#64748B" />
      <rect x="170" y="45" width="22" height="12" rx="3" fill="#64748B" />
    </g>

    {/* Green Shield Lock */}
    <g transform="translate(210, 80)">
      <path d="M 50 0 L 95 20 C 95 60, 70 95, 50 110 C 30 95, 5 60, 5 20 Z" fill="#059669" filter="drop-shadow(0px 10px 20px rgba(5,150,105,0.3))" />
      <path d="M 50 6 L 88 23 C 88 58, 66 89, 50 102 C 34 89, 12 58, 12 23 Z" fill="#34D399" />
      {/* Padlock icon in shield */}
      <rect x="35" y="45" width="30" height="30" rx="6" fill="#0F172A" />
      <path d="M 42 45 L 42 35 C 42 28, 58 28, 58 35 L 58 45" stroke="#0F172A" strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="58" r="4" fill="#34D399" />
    </g>

    {/* 3D Key */}
    <g transform="translate(130, 260) rotate(-25)">
      <circle cx="25" cy="25" r="20" stroke="#F59E0B" strokeWidth="8" fill="none" />
      <rect x="40" y="20" width="110" height="10" rx="4" fill="#F59E0B" />
      <rect x="120" y="25" width="10" height="18" rx="2" fill="#D97706" />
      <rect x="138" y="25" width="10" height="14" rx="2" fill="#D97706" />
    </g>
  </svg>
);

// Verify Email Illustration: Smartphone, open envelope, green check seal, paper plane
export const AuthIllustrationVerify = () => (
  <svg className="w-full h-auto max-w-[400px] max-h-[360px] mx-auto drop-shadow-xl" viewBox="0 0 480 420" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="240" cy="360" rx="170" ry="20" fill="#E2E8F0" opacity="0.7" />

    {/* Smartphone Base */}
    <g transform="translate(180, 110) rotate(-15)">
      <rect x="0" y="0" width="140" height="240" rx="24" fill="#0F172A" />
      <rect x="8" y="12" width="124" height="216" rx="18" fill="#E0F2FE" />
      {/* Speaker notch */}
      <rect x="45" y="20" width="30" height="4" rx="2" fill="#94A3B8" />
    </g>

    {/* Large Open Envelope coming out */}
    <g transform="translate(80, 140)">
      <rect x="0" y="30" width="180" height="120" rx="14" fill="#2563EB" stroke="#1D4ED8" strokeWidth="3" filter="drop-shadow(0px 12px 24px rgba(37,99,235,0.25))" />
      {/* Inside Paper */}
      <rect x="20" y="-20" width="140" height="100" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
      <rect x="40" y="0" width="80" height="8" rx="4" fill="#2563EB" />
      <rect x="40" y="16" width="100" height="5" rx="2.5" fill="#E2E8F0" />
      <rect x="40" y="28" width="70" height="5" rx="2.5" fill="#E2E8F0" />

      {/* Flap */}
      <path d="M 0 30 L 90 95 L 180 30" stroke="#38BDF8" strokeWidth="4" fill="none" />
    </g>

    {/* Green Check Seal */}
    <g transform="translate(190, 80)">
      <circle cx="35" cy="35" r="35" fill="#34D399" filter="drop-shadow(0px 8px 16px rgba(52,211,153,0.4))" />
      <circle cx="35" cy="35" r="28" fill="#10B981" />
      <path d="M 23 35 L 31 43 L 47 25" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>

    {/* Floating Paper Airplane */}
    <g transform="translate(330, 90) rotate(20)">
      <path d="M 0 20 L 50 0 L 25 40 L 20 25 Z" fill="#38BDF8" />
      <path d="M 50 0 L 20 25 L 50 20 Z" fill="#2563EB" />
    </g>
    <path d="M 260 160 C 290 140, 310 115, 330 95" stroke="#94A3B8" strokeWidth="2.5" strokeDasharray="6 6" fill="none" />
  </svg>
);
