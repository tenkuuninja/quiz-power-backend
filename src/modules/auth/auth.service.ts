import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities';
import { GetProfileDto, LoginDto } from './dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      return null;
      //   throw new UnauthorizedException('Credentials incorrect!');
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      return null;
      //   throw new UnauthorizedException('Credentials incorrect!');
    }

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: {
        username: dto.username,
      },
    });

    if (!user) {
      throw new BadRequestException('Password is incorrect');
    }

    const passwordCorrect = await bcrypt.compare(dto.password, user.password);
    if (!passwordCorrect) {
      throw new BadRequestException('Password is incorrect');
    }

    const userPayload = {
      id: user.id,
      role: user.role,
      status: user.status,
    };

    return {
      access_token: this.jwtService.sign(userPayload, {
        secret: 'Mysecret',
      }),
      user,
    };
  }

  async register(dto: RegisterDto) {
    const userExistByPhone = await this.usersRepository.findOne({
      where: {
        username: dto.username,
      },
    });

    if (userExistByPhone) {
      throw new BadRequestException('Username is exist');
    }

    const hash = bcrypt.hashSync(dto.password, 10);

    await this.usersRepository.insert({
      username: dto.username,
      password: hash,
      name: dto.username,
      avatar: '',
    });

    return { result: 'success' };
  }

  // async logout(userId: number) {
  //   await this.prisma.appuser.update({
  //     data: { refreshToken: null },
  //     where: { appUserId: userId },
  //   });
  // }

  // async refreshAccessToken(oldRefreshToken: string) {
  //   const user = await this.prisma.appuser.findFirst({
  //     where: { refreshToken: oldRefreshToken },
  //   });

  //   if (!user) {
  //     throw new UnauthorizedException();
  //   }

  //   const { accessToken, refreshToken } = await this.generateUserToken(user);

  //   await this.prisma.appuser.update({
  //     data: { refreshToken },
  //     where: { appUserId: user.appUserId },
  //   });

  //   return {
  //     accessToken,
  //   };
  // }

  async getProfile(dto: GetProfileDto) {
    const user = await this.usersRepository.findOne({
      where: {
        id: dto.id,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      data: user,
    };
  }
}
