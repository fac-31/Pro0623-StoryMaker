import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'media', // Automatically switches based on system preference
	theme: {
		extend: {
			transitionProperty: {
				DEFAULT: 'all'
			},
			transitionDuration: {
				DEFAULT: '300ms'
			},
			transitionTimingFunction: {
				DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)'
			}
		}
	},
	variants: {
		extend: {
			transform: ['motion-reduce'],
			transitionProperty: ['motion-reduce'],
			transitionDuration: ['motion-reduce'],
			transitionTimingFunction: ['motion-reduce']
		}
	},
	plugins: [forms, typography, daisyui],
	daisyui: {
		themes: [
			{
				light: {
					primary: '#7c3aed',
					'primary-focus': '#6d28d9',
					'primary-content': '#ffffff',
					secondary: '#2563eb',
					'secondary-focus': '#1d4ed8',
					'secondary-content': '#ffffff',
					accent: '#10b981',
					'accent-focus': '#059669',
					'accent-content': '#ffffff',
					neutral: '#374151',
					'neutral-focus': '#1f2937',
					'neutral-content': '#ffffff',
					'base-100': '#ffffff',
					'base-200': '#f9fafb',
					'base-300': '#f3f4f6',
					'base-content': '#1f2937',
					info: '#3b82f6',
					success: '#10b981',
					warning: '#f59e0b',
					error: '#ef4444'
				}
			},
			{
				dark: {
					primary: '#8b5cf6',
					'primary-focus': '#7c3aed',
					'primary-content': '#ffffff',
					secondary: '#3b82f6',
					'secondary-focus': '#2563eb',
					'secondary-content': '#ffffff',
					accent: '#10b981',
					'accent-focus': '#059669',
					'accent-content': '#ffffff',
					neutral: '#1f2937',
					'neutral-focus': '#111827',
					'neutral-content': '#d1d5db',
					'base-100': '#1f2937',
					'base-200': '#374151',
					'base-300': '#4b5563',
					'base-content': '#f9fafb',
					info: '#60a5fa',
					success: '#34d399',
					warning: '#fbbf24',
					error: '#f87171'
				}
			}
		],
		darkTheme: 'dark', // Name of the dark theme
		base: true, // Apply background color and foreground color for root element
		styled: true, // Include daisyUI colors and design decisions
		utils: true, // Add responsive and modifier utility classes
		prefix: '', // Prefix for daisyUI classnames (components, modifiers and responsive class names)
		logs: true, // Show info about daisyUI version and used config in the console when building CSS
		themeRoot: ':root' // The element that receives theme color CSS variables
	}
};
