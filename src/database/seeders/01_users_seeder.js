import bcrypt from 'bcrypt';

exports.seed = async function(knex) {
  // Clear existing entries
  await knex('users').del();
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // Insert seed entries
  await knex('users').insert([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      email_verified_at: knex.fn.now(),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      id: 2,
      name: 'Regular User',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user',
      email_verified_at: knex.fn.now(),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ]);
};