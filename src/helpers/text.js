import {base_url as baseURL} from "#app/configs/app";

export function lower(str) {
	return String(str).toLocaleLowerCase();
}

export const base_url = function (url = "") {
	const base = baseURL.replace(/^\/+|\/+$/g, "");
	const to = url.replace(/^\/+|\/+$/g, "");
	return `${base}/${to}`;
};

export const uniqid = function (prefix = "", random = false) {
	const sec = Date.now() * 1000 + Math.random() * 1000;
	const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
	return `${prefix}${id}${random ? `.${Math.trunc(Math.random() * 100000000)}` : ""}`;
};

export const generateInvoiceCode = function (length = 12) {
	// Format waktu (YYYYMMDDHHmmss)
	const timestamp = new Date()
		.toISOString()
		.replace(/[-T:.Z]/g, "")
		.slice(2, 14);

	// Huruf random (A-Z)
	const randomLetters = crypto.randomBytes(2).toString("hex").toUpperCase().slice(0, 2);

	// Angka random (0-9)
	const randomNumbers = Math.floor(Math.random() * 100000)
		.toString()
		.padStart(5, "0");

	// Gabungkan semua bagian
	let invoiceCode = `${timestamp}${randomLetters}${randomNumbers}`;

	// Potong sesuai panjang yang diminta
	return invoiceCode.slice(0, length);
};

export const generateUniqueCode = function (length = 16) {
	return crypto.randomBytes(length).toString("hex").toUpperCase();
};

export const toTitleCase = function (str) {
	return str
		.toLowerCase()
		.split(" ")
		.map(function (word) {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
};

export const sanitize_int = function (value) {
	return value.toString().replace(/[^0-9]/g, "");
};

export const random_number = function (min, max) {
	const rand = Math.random() * (max - min) + min;
	return parseInt(rand);
};

export const sanitize_alphanum = function (value) {
	return value
		.toString()
		.toLowerCase()
		.replace(/[^0-9a-z]/g, "");
};

export const sanitize_email = function (value) {
	return value
		.toString()
		.toLowerCase()
		.replace(/[^0-9a-z\@\.\_\-]/g, "");
};

export const isJsonString = function (str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
};

export const number_format = function (value = "0") {
	return Intl.NumberFormat().format(parseInt(value)).replace(",", ".");
};

export const idr = number_format;

export const randomString = function () {
	const salt = parseInt(Math.random().toString().substr(2)).toString(36);
	const combine = salt.concat((Date.now() + parseInt(Math.random().toString().substr(2))).toString(36));
	return combine;
};
