import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { OtpEntity, UserEntity } from '../../entities';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ForgotPasswordVerifyDto,
  GetProfileDto,
  LoginDto,
  UpdateProfileDto,
} from './dto';
import { RegisterDto } from './dto/register.dto';
import { MailService } from '../mail/mail.service';
import { makeCodeNumber } from '../../common/helpers/string.helper';
import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
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
    const user = await this.userRepository.findOne({
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
    const userExisted = await this.userRepository.findOne({
      where: [
        {
          email: dto.email,
        },
        {
          username: dto.username,
        },
      ],
    });

    if (userExisted) {
      throw new BadRequestException('Username or email is exist');
    }

    const hash = bcrypt.hashSync(dto.password, 10);

    await this.userRepository.insert({
      username: dto.username,
      email: dto.email,
      password: hash,
      name: dto.name,
      avatar: faker.image.avatar(),
    });

    return { result: 'success' };
  }

  // async logout(userId: number) {
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

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new BadRequestException('User is not exist!');
    }

    const otpCode = makeCodeNumber();

    await this.otpRepository.upsert(
      {
        address: dto.email,
        code: otpCode,
        expiredAt: dayjs().add(1, 'minute').toISOString(),
      },
      {
        conflictPaths: {
          address: true,
        },
      },
    );

    await this.mailService.sendOtpCode(dto.email, otpCode);

    return {
      result: 'success',
    };
  }

  async forgotPasswordVerify(dto: ForgotPasswordVerifyDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new BadRequestException('User is not exist!');
    }

    const otp = await this.otpRepository.findOne({
      where: {
        address: dto.email,
        code: dto.otp,
      },
    });

    if (!otp) {
      throw new BadRequestException('Invalid code!');
    }

    if (dayjs(otp.expiredAt).isBefore(dayjs())) {
      throw new BadRequestException('Code expired!');
    }

    const hash = bcrypt.hashSync(dto.password, 10);
    user.password = hash;
    await this.userRepository.save(user);
    await this.otpRepository.delete(otp);

    return {
      result: 'success',
    };
  }

  async getProfile(dto: GetProfileDto) {
    const user = await this.userRepository.findOne({
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

  async updateProfile(dto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: dto.id,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    user.name = dto.name;
    user.avatar = dto.avatar;
    await this.userRepository.save(user);

    return {
      result: 'success',
    };
  }

  async changePasswordProfile(dto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: dto.id,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordCorrect = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );
    if (!passwordCorrect) {
      throw new BadRequestException('Password is incorrect');
    }

    const hash = bcrypt.hashSync(dto.newPassword, 10);
    user.password = hash;
    await this.userRepository.save(user);

    return {
      result: 'success',
    };
  }
}
