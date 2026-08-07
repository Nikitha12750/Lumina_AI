/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            colors: {
                // Calm, understated linear-inspired palette
                workspace: '#0F1115',
                surface: '#171A21',
                'surface-secondary': '#1D212A',
                'surface-hover': '#242934',
                'border-subtle': 'rgba(255, 255, 255, 0.08)',
                'border-strong': 'rgba(255, 255, 255, 0.14)',
                'text-primary': '#F8FAFC',
                'text-secondary': '#94A3B8',
                'text-muted': '#64748B',
                accent: {
                    DEFAULT: '#4F8EF7',
                    hover: '#5B8DEF',
                    active: '#3B7AE5',
                    subtle: 'rgba(79, 142, 247, 0.12)',
                    border: 'rgba(79, 142, 247, 0.3)',
                },
            },
            borderRadius: {
                DEFAULT: '6px',
                sm: '4px',
                md: '6px',
                lg: '8px',
                xl: '10px',
            },
            boxShadow: {
                'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
                'elevation': '0 4px 12px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.4)',
                'popover': '0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
            },
            transitionDuration: {
                DEFAULT: '150ms',
                'fast': '100ms',
                'normal': '150ms',
            },
        },
    },
    plugins: [],
}
