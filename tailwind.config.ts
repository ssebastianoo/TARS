import konstaConfig from 'konsta/config';

// wrap your config with konstaConfig
module.exports = konstaConfig({
	content: ['./src/**/*.{html,js,svelte,ts}'],

	konsta: {
		colors: {
			primary: '#fa903e'
		}
	},

	theme: {
		extend: {
			keyframes: {
				grow: {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.1)' }
				}
			},
			animation: {
				grow: 'grow 1.3s ease-in-out infinite'
			}
		}
	},

	plugins: []
});
