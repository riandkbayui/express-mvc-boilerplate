// auto_routing.js
import express from "express";
import { dependencies } from "#systems/dependencies";

export default function autoRouter() {
  const router = express.Router();
  const controllersDep = dependencies.find(dep => dep.path === "controllers");

  for (const [filePath, controllerModule] of controllersDep.collections.entries()) {
    const controller = controllerModule.default || controllerModule;

    let routePath = "/" + filePath.replace(/^controllers\//, "");

    // Dynamic param: [id] → :id
    // Sekaligus catat param untuk validasi
    const paramNames = [];
    routePath = routePath.replace(/\[([^\]]+)\]/g, (_, param) => {
      paramNames.push(param);
      return `:${param}`;
    });

    if (routePath.endsWith("/index")) {
      routePath = routePath.slice(0, -6) || "/";
    }
    routePath = routePath.replace(/\/+/g, "/");

    for (const [methodName, handler] of Object.entries(controller)) {
      const httpMethod = methodName.match(/^(get|post|put|delete|patch)/i)?.[0]?.toLowerCase();
      if (!httpMethod) continue;

      let subPath = methodName.replace(/^(get|post|put|delete|patch)/i, "");
      if (subPath.toLowerCase() === "index") subPath = "";
      else {
        subPath = "/" + subPath
          .replace(/_/g, "-") // underscore → dash
          .replace(/([a-z])([A-Z])/g, "$1-$2") // camelCase → kebab-case
          .toLowerCase();
      }

      const fullPath = (routePath + subPath).replace(/\/+/g, "/");

      // Middleware validasi param
      const paramValidator = (req, res, next) => {
        for (const param of paramNames) {
          if (req.params[param] && !/^[a-zA-Z0-9-_]+$/.test(req.params[param])) {
            return res.status(400).json({ error: `Invalid value for parameter "${param}"` });
          }
        }
        next();
      };

      router[httpMethod](fullPath, paramValidator, handler);
    }
  }

  return router;
}