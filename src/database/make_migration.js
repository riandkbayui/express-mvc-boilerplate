import {db} from "#configs/database";

const table = process.argv[2];
db.migrate.make(table);