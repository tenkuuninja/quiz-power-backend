import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { DeepPartial, EntityManager } from 'typeorm';
import {
  EQuestionType,
  EQuizStatus,
  EQuizVisibility,
  EUserRole,
  EUserStatus,
} from '../../common/enums/entity.enum';
import {
  CategoryEntity,
  QuestionEntity,
  QuizEntity,
  UserEntity,
} from '../../entities';
import { dataSource } from '../datasource';

const createFakeUser = (): DeepPartial<UserEntity> => {
  const password = bcrypt.hashSync('Quiz@2024', 10);
  return {
    name: faker.internet.displayName(),
    username: faker.internet.userName(),
    password: password,
    avatar: faker.image.avatar(),
    status: EUserStatus.Active,
  };
};

const createFakeQuiz = (payload: {
  userId: number;
  categories: DeepPartial<CategoryEntity>[];
}): DeepPartial<QuizEntity> => {
  const createFakeQuestion = (): DeepPartial<QuestionEntity> =>
    faker.helpers.arrayElement([
      {
        questionType: EQuestionType.SingleChoice,
        content: faker.lorem.sentence(),
        options: faker.helpers.shuffle([
          {
            content: faker.lorem.words({ min: 1, max: 5 }),
            isCorrect: true,
          },
          ...faker.helpers.multiple(
            () => {
              return {
                content: faker.lorem.words({ min: 1, max: 5 }),
                isCorrect: faker.helpers.arrayElement([true, false]),
              };
            },
            { count: faker.helpers.rangeToNumber({ min: 1, max: 3 }) },
          ),
        ]),
      },
      {
        questionType: EQuestionType.MultipleChoice,
        content: faker.lorem.sentence(),
        options: faker.helpers.multiple(
          () => {
            return {
              content: faker.lorem.words({ min: 1, max: 5 }),
              isCorrect: faker.helpers.arrayElement([true, false]),
            };
          },
          { count: faker.helpers.rangeToNumber({ min: 2, max: 4 }) },
        ),
      },
      {
        questionType: EQuestionType.TextEntryWithLength,
        content: faker.lorem.sentence(),
        answerLength: 5,
        options: [
          {
            content: faker.lorem.word(5),
            isCorrect: true,
          },
        ],
      },
    ]);

  return {
    name: faker.lorem.text(),
    status: faker.helpers.arrayElement([
      EQuizStatus.Draft,
      EQuizStatus.Published,
    ]),
    visibility: faker.helpers.arrayElement([
      EQuizVisibility.Private,
      EQuizVisibility.Public,
    ]),
    user: {
      id: payload?.userId,
    },
    categories: payload?.categories,
    questions: faker.helpers.multiple(createFakeQuestion, {
      count: faker.helpers.rangeToNumber({ min: 5, max: 15 }),
    }),
  };
};

const run = async () => {
  await dataSource.initialize();
  await dataSource.connect();

  await dataSource.manager.transaction(async (entityManager: EntityManager) => {
    const userRepository = entityManager.getRepository(UserEntity);
    const categoryRepository = entityManager.getRepository(CategoryEntity);

    const newUsers = faker.helpers.multiple(createFakeUser, { count: 20 });
    const password = bcrypt.hashSync('Quiz@2024', 10);
    newUsers.unshift({
      name: faker.internet.displayName(),
      username: faker.internet.userName(),
      password: password,
      avatar: faker.image.avatar(),
      status: EUserStatus.Active,
      role: EUserRole.Admin,
    });
    await entityManager.save(UserEntity, newUsers);

    const users = await entityManager.find(UserEntity);
    const categories = await entityManager.find(CategoryEntity);

    const newQuizzes = users
      .map((user) =>
        faker.helpers.multiple(
          () =>
            createFakeQuiz({
              userId: user.id,
              categories: faker.helpers.arrayElements(categories, {
                min: 3,
                max: 8,
              }),
            }),
          {
            count: 20,
          },
        ),
      )
      .flat();

    // console.log(newQuizzes);
    console.log(JSON.stringify(newQuizzes, null, 2));
    await entityManager.save(QuizEntity, newQuizzes);
  });

  console.log('Seeded user!');
};

run();
