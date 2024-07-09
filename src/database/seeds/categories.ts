import { CategoryEntity } from '../../entities';
import { dataSource } from '../datasource';

const categories = [
  { id: 1, name: 'Lớp 1' },
  { id: 2, name: 'Lớp 2' },
  { id: 3, name: 'Lớp 3' },
  { id: 4, name: 'Lớp 4' },
  { id: 5, name: 'Lớp 5' },
  { id: 6, name: 'Lớp 7' },
  { id: 7, name: 'Lớp 8' },
  { id: 8, name: 'Lớp 9' },
  { id: 9, name: 'Lớp 10' },
  { id: 10, name: 'Lớp 11' },
  { id: 11, name: 'Lớp 12' },
];

const run = async () => {
  await dataSource.initialize();
  await dataSource.connect();

  await Promise.all(
    categories.map(async (cate) => {
      const category = new CategoryEntity();
      category.name = cate.name;

      await dataSource.manager.save(CategoryEntity, category);
    }),
  );

  console.log('Seeded categories!');
};

run();
