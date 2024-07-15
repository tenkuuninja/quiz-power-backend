import { dataSource } from './datasource';

const run = async () => {
  await dataSource.initialize();
  if (process.argv.includes('push')) {
    await dataSource.synchronize();
    console.log('Database synchronized!');
  }
  if (process.argv.includes('drop')) {
    await dataSource.dropDatabase();
    console.log('Database dropped!');
  }
  await dataSource.destroy();
};

run();
