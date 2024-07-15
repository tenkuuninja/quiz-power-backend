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
