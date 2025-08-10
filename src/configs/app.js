import path from "path";
import dotenv from "dotenv";

const dotEnvPath = path.join(process.cwd(), ".env");

dotenv.config({
	path: dotEnvPath,
});

export const env = dotenv;
export const port = process.env.port || 5000;
export const auto_routing = true;
export const base_url = process.env.base_url || "/";
export const time_zone = process.env.time_zone || "Asia/Jakarta";
export const jwt_private_key = process.env.jwt_private_key || "HhGFAjNBPKd07bZtDhLfwPgB5jFgzG";
export const session_name = process.env.session_name || "x-session-express";
export const logging = {
	level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
	format: process.env.LOG_FORMAT || "combined",
};
export default {
	port,
	base_url,
	jwt_private_key,
	session_name,
    logging, env,
	auto_routing
};
