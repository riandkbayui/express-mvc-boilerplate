import express from 'express';
import { dependencies } from '#systems/dependencies';

const controller = (str) => {
	return async (req, res, next) => {
			const [fileName, method] = str.split('.');
			const deps = dependencies.find(v => v.path == "controllers");
			const instance = deps.collections.get(`controllers/${fileName}`);
			return instance[method].apply(this, [{req, res}]);
        };
	}

const middleware = (str) => {
	return async (req, res, next) => {
		const [fileName, params] = str.split(':');
		const deps = dependencies.find(v => v.path == "middlewares");
		const instance = deps.collections.get(`middlewares/${fileName}`);
		return instance.default.apply(this, [{params, req, res, next}]);
	};
}

export default function init() {
	express.Router.controller = (name) => {
		return async (req, res, next) => {
			const handler = controller(name);
			return handler(req, res, next);
		};
	};
	express.Router.middleware = (name) => {
		return async (req, res, next) => {
			const handler = middleware(name);
			return handler(req, res, next);
		};
	};

	return (req, res, next) => {
		next();
	};
}