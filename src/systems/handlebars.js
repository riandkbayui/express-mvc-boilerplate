import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { base_url } from '#app/helpers/text';

const VIEW_ROOT = path.join(process.cwd(), 'src', 'views');

const handlebarsHelpers = {
	base_url,

	if(expression, options) {
		try {
			const context = {
				...options.data.root,
				...this
			};
			const fn = Function(...Object.keys(context), `"use strict"; return (${expression})`);
			const result = fn(...Object.values(context));
			return result ? options.fn(this) : options.inverse(this);
		} catch (err) {
			console.error('Error in ifCond:', err);
			return options.inverse(this);
		}
	},

	echo(expression, options) {
		try {
			const context = {
				...options.data.root,
				...this
			};
			const fn = Function(...Object.keys(context), `"use strict"; return (${expression})`);
			return fn(...Object.values(context));
		} catch (err) {
			console.error('Error in print:', err);
			return '';
		}
	},

	section(name, options) {
		var helper = this;
		if (!this._sections) {
			this._sections = {};
			this._sections._get = function (arg) {
				if (typeof helper._sections[arg] === 'undefined') {
					return '';
				} else {
					return helper._sections[arg];
				}
			};
		}

		if (!this._sections[name]) {
			this._sections[name] = options.fn(this);
		}

		return null;
	},

	render_section(name) {
		try {
			return this._sections._get(name);
		} catch (err) {
			return '';
		}
	},

	formatDate(date, locale = 'id-ID') {
		try {
			return new Date(date).toLocaleDateString(locale);
		} catch {
			return '';
		}
	},

	view(relativePath, context = {}) {
		try {
			const fullPath = path.join(VIEW_ROOT, `${relativePath}.hbs`);
			const templateContent = fs.readFileSync(fullPath, 'utf8');
			const template = handlebars.compile(templateContent);

			const finalContext = {
				...this,
				...JSON.parse(context),
			};

			return new handlebars.SafeString(template(finalContext));
		} catch (err) {
			console.error(`Error rendering view '${relativePath}':`, err);
			return '';
		}
	},
};

export default handlebarsHelpers;
