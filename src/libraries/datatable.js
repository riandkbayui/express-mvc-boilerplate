import db from '#configs/database';

export default class Datatable {
    
    constructor() {
        this.table_name = null;
        this.req = null;
        this.res = null;
        this.search = [];
        this.params = [];
    }

    setTable(tb) {
        this.table_name = tb;
    }

    setRest(req, res) {
        this.req = req;
        this.res = res;
    }

    setSearch(search) {
        this.search = search;
    }

    setParams(params) {
        this.params = params;
    }

    extractSelectColumns(params) {
        const columns = [];
        params.forEach(data => {
            if (data.includes && data.includes('select')) {
                data.forEach(d => {
                    if (d !== 'select') {
                        const regx = d.match(/.+?(?=\sas)/gi);
                        columns.push(regx ? regx[0] : d);
                    }
                });
            }
        });
        return columns;
    }

    hasWhere(params) {
        return params.some(data => data.includes && data.includes('where'));
    }

    async findOne(params=false) {
		const qbuilder = db(this.table_name);
		const filters = [];
		var noSelect = true;
		var addLimit = true;

		if(Array.isArray(params)) {
			params.forEach((v, k)=>{
				if(
                    v.indexOf('select') > -1 || 
                    v.indexOf('count') > -1 || 
                    v.indexOf('sum') > -1
                ) noSelect = false;

                if(
                    v.indexOf('count') > -1 || 
                    v.indexOf('sum') > -1
                ) addLimit = false;
                
				filters.push(v);
			});
		}

		if(noSelect) {
			filters.push(['select', '*']);
		}

		if(addLimit) {
			filters.push(['limit', '1']);
		}

		filters.forEach((v, k)=>{
		    const params = Object.assign([], v);
		    params.splice(0,1);
		    qbuilder[v[0]](...params);
		})
        const [data] = (await qbuilder) || [];
		return data;
	}

	async findAll(params=false) {
		const qbuilder = db(this.table_name);
		const filters = [];
		var noSelect = true;

		if(Array.isArray(params)) {
			params.forEach((v, k)=>{
				if(
                    v.indexOf('select') > -1 || 
                    v.indexOf('count') > -1 || 
                    v.indexOf('sum') > -1
                ) noSelect = false;
				filters.push(v);
			});
		}

		if(noSelect) {
			filters.push(['select', '*']);
		}

		filters.forEach((v, k)=>{
		    const params = Object.assign([], v);
		    params.splice(0,1);
		    qbuilder[v[0]](...params);
		})
		return qbuilder;
	}

    async render(params = {}, cb = undefined) {
        try {
            const start = this.req.body.start || 0;
            const length = this.req.body.length || 10;
            const searchValue = this.req.body.search?.value || "";
            const orderColumn = this.req.body.order?.[0]?.column ?? "";
            const orderDir = this.req.body.order?.[0]?.dir ?? "asc";

            // Extract columns if not set
            if (this.search.length === 0) {
                this.search = this.extractSelectColumns(this.params);
            }

            // Search
            if (searchValue.length > 0 && this.search.length > 0) {
                if (!this.hasWhere(this.params)) {
                    this.params.push(['where', (qbuilder) => {
                        this.search.forEach(col => {
                            qbuilder.orWhere(col, 'like', `%${searchValue}%`);
                        });
                    }]);
                }
            }

            // Order
            if (orderColumn !== "" && this.search[orderColumn]) {
                this.params.push(['orderBy', this.search[orderColumn], orderDir]);
            }

            // Limit & Offset
            this.params.push(['limit', length]);
            this.params.push(['offset', start]);

            const data = await this.findAll(this.params);
            if (cb) await cb(data);

            const draw = this.req.body.draw;
            const rawFilter = this.params.filter(data =>
                !data.includes('select') &&
                !data.includes('limit') &&
                !data.includes('offset')
            );

            const recordsFilter = [['count', `${this.table_name}.id as total`], ...rawFilter];
            const getRecords = await this.findOne(recordsFilter);
            const recordsFiltered = getRecords?.total || 0;
            const recordsTotal = recordsFiltered;

            let s = {
                draw,
                data,
                recordsFiltered,
                recordsTotal,
            };

            if (typeof params === 'object') {
                s = Object.assign(s, params);
            }

            return this.res.json(s);
        } catch (error) {
            console.log(error);
            let s = {
                draw: this.req.body.draw,
                data: [],
                recordsFiltered: 0,
                recordsTotal: 0,
            };

            if (typeof params === 'object') {
                s = Object.assign(s, params);
            }

            return this.res.json(s);
        }
    }


}