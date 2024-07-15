import { CategoryEntity } from '../../entities';
import { dataSource } from '../datasource';

const categories = [
  { id: 1, name: 'Lịch sử' },
  { id: 2, name: 'Địa lý' },
  { id: 3, name: 'Khoa học' },
  { id: 4, name: 'Văn học' },
  { id: 5, name: 'Toán học' },
  { id: 6, name: 'Ngôn ngữ' },
  { id: 7, name: 'Nghệ thuật' },
  { id: 8, name: 'Thể thao' },
  { id: 9, name: 'Công nghệ' },
  { id: 10, name: 'Giải trí' },
  { id: 11, name: 'Ẩm thực' },
  { id: 12, name: 'Sức khỏe' },
  { id: 13, name: 'Đời sống' },
];

const run = async () => {
  const connectedDataSource = await dataSource.initialize();

  console.log(
    'Connected!',
    connectedDataSource.isInitialized,
    connectedDataSource.isConnected,
  );
  await connectedDataSource.manager.save(CategoryEntity, categories);

  console.log('Seeded categories!');

  await dataSource.destroy();
};

run();
