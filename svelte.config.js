import path from 'path';
import netlify from '@sveltejs/adapter-netlify';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: netlify(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			resolve: {
				alias: {
					'@components': path.resolve('./src/components'),
					'@utils': path.resolve('./src/utils')
				}
			}
		}
	}
};

export default config;
