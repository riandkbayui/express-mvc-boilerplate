export const up = function(knex) {
  /**
     * @param { import('knex').Knex.CreateTableBuilder } table
    */
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('email', 255).unique().notNullable();
    table.timestamp('email_verified_at').nullable();
    table.string('password', 255).notNullable();
    table.string('avatar', 255).nullable();
    table.enum('role', ['admin', 'user']).defaultTo('user');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('last_login_at').nullable();
    table.string('remember_token', 100).nullable();
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();
    
    table.index(['email']);
    table.index(['role']);
    table.index(['is_active']);
    table.index(['deleted_at']);
  });
};

export const down = function(knex) {
  return knex.schema.dropTable('users');
};