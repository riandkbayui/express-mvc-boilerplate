import db from '#app/configs/database';
import logger from '#app/systems/logger';

async function seed() {
  try {
    logger.info('Running database seeders...');
    await db.seed.run();
    logger.info('✅ Database seeding completed');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();