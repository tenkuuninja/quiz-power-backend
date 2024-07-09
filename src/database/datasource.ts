import { DataSource } from 'typeorm';
import { DATABASE_URL } from '../configs/app';
import { DefaultNamingStrategy, Table, NamingStrategyInterface } from 'typeorm';
import crypto from 'crypto';
import * as Entities from '../entities';

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

export const dataSource = new DataSource({
  type: 'mysql',
  url: DATABASE_URL,
  // entities: [`**/**.entity{.ts,.js}`],
  entities: Object.values(Entities),
  namingStrategy: new CustomNamingStrategy(),
  synchronize: true,
});

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
