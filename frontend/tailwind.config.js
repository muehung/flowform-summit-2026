import forms from '@tailwindcss/forms'
import containerQueries from '@tailwindcss/container-queries'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
        "colors": {
            "primary-fixed-dim": "#c2c6d3",
            "secondary-fixed": "#e1e0ff",
            "surface-container-high": "#e7e8e9",
            "on-tertiary": "#ffffff",
            "primary-container": "#2d323c",
            "surface-container": "#edeeef",
            "gradient-end": "#2B86C5",
            "surface-container-highest": "#e1e3e4",
            "tertiary-fixed-dim": "#ffb2b7",
            "on-tertiary-fixed": "#40000d",
            "on-secondary-fixed": "#07006c",
            "secondary": "#4648d4",
            "inverse-primary": "#c2c6d3",
            "surface-variant": "#e1e3e4",
            "tertiary-fixed": "#ffdadb",
            "tertiary-container": "#6a001c",
            "outline": "#76777c",
            "inverse-surface": "#2e3132",
            "on-secondary": "#ffffff",
            "inverse-on-surface": "#f0f1f2",
            "tertiary": "#43000e",
            "primary": "#181d26",
            "tag-bg": "#F1F5F9",
            "primary-fixed": "#dee2f0",
            "surface-container-lowest": "#ffffff",
            "on-primary-container": "#959aa6",
            "surface-tint": "#595e69",
            "on-error": "#ffffff",
            "secondary-container": "#6063ee",
            "background": "#f8f9fa",
            "on-primary-fixed": "#171c25",
            "outline-variant": "#c6c6cc",
            "surface-container-low": "#f3f4f5",
            "on-background": "#191c1d",
            "on-error-container": "#93000a",
            "on-surface-variant": "#45474b",
            "gradient-middle": "#784BA0",
            "on-tertiary-fixed-variant": "#92002a",
            "surface": "#f8f9fa",
            "secondary-fixed-dim": "#c0c1ff",
            "success": "#10B981",
            "on-secondary-container": "#fffbff",
            "surface-bright": "#f8f9fa",
            "on-surface": "#191c1d",
            "on-secondary-fixed-variant": "#2f2ebe",
            "on-primary-fixed-variant": "#424751",
            "error": "#EF4444",
            "on-primary": "#ffffff",
            "gradient-start": "#FF3CAC",
            "on-tertiary-container": "#ff6678",
            "surface-dim": "#d9dadb",
            "error-container": "#ffdad6"
        },
        "borderRadius": {
            "DEFAULT": "0.125rem",
            "lg": "0.25rem",
            "xl": "0.5rem",
            "full": "0.75rem"
        },
        "spacing": {
            "gutter": "24px",
            "stack-sm": "8px",
            "container-max": "800px",
            "stack-lg": "48px",
            "stack-md": "24px",
            "margin-mobile": "16px"
        },
        "fontFamily": {
            "headline-lg": ["Hanken Grotesk"],
            "body-md": ["Hanken Grotesk"],
            "display-lg": ["Hanken Grotesk"],
            "headline-md": ["Hanken Grotesk"],
            "headline-lg-mobile": ["Hanken Grotesk"],
            "label-sm": ["Hanken Grotesk"],
            "body-lg": ["Hanken Grotesk"],
            "label-mono": ["JetBrains Mono"]
        },
        "fontSize": {
            "headline-lg": ["32px", {"lineHeight": "40px", "fontWeight": "700"}],
            "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
            "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "800"}],
            "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
            "headline-lg-mobile": ["24px", {"lineHeight": "32px", "fontWeight": "700"}],
            "label-sm": ["12px", {"lineHeight": "16px", "fontWeight": "600"}],
            "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
            "label-mono": ["14px", {"lineHeight": "20px", "letterSpacing": "0.02em", "fontWeight": "500"}]
        }
    },
  },
  plugins: [forms, containerQueries],
}