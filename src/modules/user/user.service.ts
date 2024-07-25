import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Raw, Repository } from 'typeorm';
import { UserEntity } from '../../entities';
import { DeleteUserDto, GetListUserDto } from './dto';
import { EUserRole } from '../../common/enums/entity.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getListUser(dto: GetListUserDto) {
    const user = await this.userRepository.find({
      where: {
        name: dto.search
          ? Raw((alias) => `LOWER(${alias}) Like LOWER(:search)`, {
              search: `%${dto.search}%`,
            })
          : undefined,
        role: EUserRole.User,
      },
      relations: ['quizzes'],
      order: {
        createdAt: 'DESC',
      },
      take: +dto.pageSize,
      skip: +(dto.page - 1) * +dto.pageSize,
    });
    const total = await this.userRepository.count({
      where: {
        name: dto.search
          ? Raw((alias) => `LOWER(${alias}) Like LOWER(:search)`, {
              search: `%${dto.search}%`,
            })
          : undefined,
      },
    });
    return { data: user, total: total };
  }

  async deleteUser(dto: DeleteUserDto) {
    await this.userRepository.delete({
      id: +dto.id,
    });

    return {
      result: 'success',
    };
  }
}
