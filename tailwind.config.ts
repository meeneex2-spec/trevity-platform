import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#2563EB',
        'brand-blue-hover': '#1D4ED8',
        'brand-blue-sec': '#60A5FA',
        'brand-mint': '#5EEAD4',
        'text-dark': '#0F172A',
        'text-mid': '#334155',
        'text-sub': '#64748B',
        'bg-sub': '#F8FAFC',
        'bg-hero': '#0F172A',
        'bg-blue-soft': '#EFF6FF',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans KR', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
