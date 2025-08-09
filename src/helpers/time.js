import moment from "moment";
import { time_zone } from "#app/configs/app";

export const dateFormat = function (date, format="DD/MM/YYYY") {
	return moment(date).format(format);
};

export const now = function (format="YYYY-MM-DD HH:mm:ss") {
	return moment().tz(time_zone).format(format);
};