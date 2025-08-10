import {dependencies} from "#systems/dependencies";
import prefixMiddlewares from "#configs/middlewares";
import express from "express";

// Helper untuk cek apakah request adalah file statis
function isStaticRequest(url) {
	return /\.[a-zA-Z0-9]+$/.test(url);
	// contoh match: /style.css, /app.js, /logo.png, /favicon.ico
}

function getMiddlewareFns(mwNames) {
	const middlewaresDep = dependencies.find((dep) => dep.path === "middlewares");

	return mwNames.map((name) => {
		let mwName = name;
		let mwParams = [];

		if (name.includes(":")) {
			const [n, args] = name.split(":");
			mwName = n;
			mwParams = args.split(",");
		}

		const mwModule = middlewaresDep.collections.get(`middlewares/${mwName}`);
		if (!mwModule) throw new Error(`Middleware "${mwName}" tidak ditemukan`);

		const mwFn = mwModule.default || mwModule;

		// Bungkus: tambahkan pengecekan static file
		return (req, res, next) => {
			if (isStaticRequest(req.path)) return next(); // skip file statis
			mwFn({params: mwParams, req, res, next});
		};
	});
}

export function applyPrefixMiddleware() {
	const router = express.Router();
	for (const prefix in prefixMiddlewares) {
		const fns = getMiddlewareFns(prefixMiddlewares[prefix]);

		if (prefix === "/") {
			router.use(...fns); // global tapi skip file statis
		} else {
			router.use(prefix, ...fns);
		}
	}
	return router;
}
