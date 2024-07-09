import { DataSource } from 'typeorm';
import { DATABASE_URL } from './app';
import { DefaultNamingStrategy, Table, NamingStrategyInterface } from 'typeorm';
import crypto from 'crypto';

class CustomNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  foreignKeyName(
    tableOrName: Table | string,
    columnNames: string[],
    referencedTablePath?: string,
    referencedColumnNames?: string[],
  ): string {
    tableOrName =
      typeof tableOrName === 'string' ? tableOrName : tableOrName.name;

    const name = columnNames.reduce(
      (name, column) => `${name}_${column}`,
      `${tableOrName}_${referencedTablePath}`,
    );

    return `fk_${crypto.createHash('md5').update(name).digest('hex')}`;
  }
}

const source = new DataSource({
  type: 'mysql',
  url: DATABASE_URL,
  entities: [`**/**.entity{.ts,.js}`],
  namingStrategy: new CustomNamingStrategy(),
});

const run = async () => {
  await source.initialize();
  if (process.argv.includes('push')) {
    await source.synchronize();
    console.log('Database synchronized!');
  }
  if (process.argv.includes('drop')) {
    await source.dropDatabase();
    console.log('Database dropped!');
  }
  await source.destroy();
};

run();
