import {db} from '#configs/database';
import logger from '#systems/logger';

async function migrate() {
  try {
    const command = process.argv[2];
    
    switch (command) {
      case 'rollback':
        logger.info('Rolling back migrations...');
        await db.migrate.rollback();
        logger.info('✅ Migration rollback completed');
        break;
        
      case 'fresh':
        logger.info('Rolling back all migrations...');
        await db.migrate.rollback(undefined, true);
        logger.info('Running fresh migrations...');
        await db.migrate.latest();
        logger.info('✅ Fresh migration completed');
        break;
        
      default:
        logger.info('Running pending migrations...');
        await db.migrate.latest();
        logger.info('✅ Migration completed');
    }
    
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();