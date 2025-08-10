import {Router as expressRouter} from 'express';

/**
 * @param {expressRouter} router
 */

export default function routerGroup() {
	// Tambahkan method group ke semua instance express.Router
	if (!expressRouter.group) {
		expressRouter.group = function (...args) {
			let path = '/';
			if (typeof args[0] === 'string') path = args.shift();

			const handler = args.pop(); // handler function (router) => {}
			const middlewares = args.flat().filter(Boolean); // sisanya = middleware

			const router = expressRouter();
			middlewares.forEach((mw) => router.use(mw)); // pasang middleware

			handler(router); // jalankan handler dan isi route

			this.use(path, router); // ← pakai use untuk daftarkan subRouter
			return this;
		}
	}

	return expressRouter();
}
