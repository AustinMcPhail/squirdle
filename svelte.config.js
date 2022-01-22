import path from 'path';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			resolve: {
				alias: {
					'@components': path.resolve('./src/components'),
					'@utils': path.resolve('./src/utils')
				}
			}
		},
		prerender: {
			enabled: true
		}
	}
};

export default config;
