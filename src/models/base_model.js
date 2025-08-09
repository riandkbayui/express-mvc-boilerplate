import {db} from "#configs/database";
import { now } from "#app/helpers/time";

export default class base_model {

	constructor() {
		this.table = "";
		this.primary_key = "id";
		this.use_timestamp = true;
		this.use_soft_delete = true;
		this.allowed_fields = [];
		this.db_transaction = null;
		this.createdField = "created_at";
		this.updatedField = "updated_at";
		this.deletedField = "deleted_at";
	}

	_applyFilters = (qb, params = []) => {
		if (this.use_soft_delete) {
			qb.whereNull(`${this.table}.${this.deletedField}`);
		}
		params.forEach((v) => {
			const [method, ...args] = v;
			qb[method](...args);
		});
	};

	/**
	 * @returns {base_model} 
	 */

	setTransaction(trx) {
		this.db_transaction = trx;
		return this;
	}

	/**
	 * @returns {import('knex').Knex}
	 */
	builder = function() {
		const qb = db(this.table);
		if (this.db_transaction) qb.transacting(this.db_transaction);
		return qb;
	}

	findOne = async function(params = false) {
		const qb = db(this.table);
		if (this.db_transaction) qb.transacting(this.db_transaction);

		if (Number.isInteger(parseInt(params))) {
			qb.where(`${this.table}.${this.primary_key}`, params);
		} else if (Array.isArray(params)) {
			this._applyFilters(qb, params);
		}

		qb.first();
		return await qb;
	};

	findAll = async function(params = false) {
		const qb = db(this.table);
		if (this.db_transaction) qb.transacting(this.db_transaction);

		if (Number.isInteger(parseInt(params))) {
			qb.where(`${this.table}.${this.primary_key}`, params);
		} else if (Array.isArray(params)) {
			this._applyFilters(qb, params);
		}

		return await qb;
	};

	paginate = async function(params = [], page = 1, perPage = 10) {
		const qb = db(this.table);
		if (this.db_transaction) qb.transacting(this.db_transaction);
		this._applyFilters(qb, params);

		const offset = (page - 1) * perPage;
		const data = await qb.clone().offset(offset).limit(perPage);
		const [{ count }] = await db(this.table).count('* as count').where(qb.clone().clearSelect().clearOrder()._statements);

		return {
			data,
			total: parseInt(count),
			page,
			perPage,
			totalPages: Math.ceil(count / perPage),
		};
	};

	_allowed_fields = async function(data) {
		const fields = {};
		Object.keys(data).forEach((v) => {
			if (this.allowed_fields.includes(v)) fields[v] = data[v];
		});
		return fields;
	};

	create = async function(data) {
		data = await this._allowed_fields(data);
		if (this.use_timestamp) data[this.createdField] = now();
		const qb = db(this.table);
		if (this.db_transaction) qb.transacting(this.db_transaction);
		return await qb.insert(data);
	};

	update = async function(filters, data) {
		data = await this._allowed_fields(data);
		if (this.use_timestamp) data[this.updatedField] = now();
		const qb = db(this.table);
		if (this.db_transaction) qb.transacting(this.db_transaction);
		if (Number.isInteger(parseInt(filters))) {
			qb.where(`${this.table}.${this.primary_key}`, filters);
		} else {
			this._applyFilters(qb, filters);
		}
		return await qb.update(data);
	};

	delete = async function(id) {
		const qb = db(this.table);
		if (this.db_transaction) qb.transacting(this.db_transaction);
		if (this.use_soft_delete) {
			const data = {};
			if (this.use_timestamp) data[this.deletedField] = now();
			if (Number.isInteger(parseInt(id))) {
				qb.where(`${this.table}.${this.primary_key}`, id);
			} else {
				qb.where(id);
			}
			return await qb.update(data);
		} else {
			if (Number.isInteger(parseInt(id))) {
				qb.where(`${this.table}.${this.primary_key}`, id);
			} else {
				qb.where(id);
			}
			return await qb.del();
		}
	};

	restore = async function(id) {
		if (!this.use_soft_delete) return false;
		const qb = db(this.table);
		if (this.db_transaction) qb.transacting(this.db_transaction);
		const data = {};
		data[this.deletedField] = null;
		if (Number.isInteger(parseInt(id))) {
			qb.where(`${this.table}.${this.primary_key}`, id);
		} else {
			qb.where(id);
		}
		return await qb.update(data);
	};

}
