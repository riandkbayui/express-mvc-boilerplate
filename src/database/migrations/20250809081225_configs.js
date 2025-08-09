/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
   /**
     * @param { import('knex').Knex.CreateTableBuilder } table
    */
  return knex.schema.createTable('configs', function(table) {
    table.increments('id').primary();
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  
}
