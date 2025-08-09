import knex from "knex";
import { env } from "#configs/app";

const mysql_client   = 'mysql2';
const mysql_database = '';
const mysql_host     = '127.0.0.1';
const mysql_port     = 3306;
const mysql_user     = '';
const mysql_pass     = '';
export const db  = knex({
    client: process.env.MYSQL_CLIENT || mysql_client,
    connection: {
        host: process.env.MYSQL_HOST || mysql_host,
        port: process.env.MYSQL_PORT || mysql_port,
        user: process.env.MYSQL_USER || mysql_user,
        password: process.env.MYSQL_PASSWORD || mysql_pass,
        database: process.env.MYSQL_DATABASE || mysql_database,
    },
    debug: process.env.NODE_ENV === 'development',
    pool: {
        min: parseInt(process.env.DB_POOL_MIN) || 2,
        max: parseInt(process.env.DB_POOL_MAX) || 99,
        acquireTimeoutMillis: 30000,
        createTimeoutMillis: 30000,
        destroyTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 100,
    },
    migrations: {
      directory: './src/database/migrations',
      stub: './src/database/migration.stub',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './src/database/seeders'
    }
});

export default db;