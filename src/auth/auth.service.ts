import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDto, SignUpDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { uuid } from 'uuidv4';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(body: SignUpDto) {
    try {
      const userExists = await this.prismaService.user.findUnique({
        where: { email: body.email },
      });

      if (userExists) {
        throw new BadRequestException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(body.password, 10);

      const newUser = await this.prismaService.user.create({
        data: {
          name: body.name,
          email: body.email,

          password: hashedPassword,
          role: body.role,
        },
      });

      // ?  remove password from user object before returning

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = newUser;
      const { accessToken, refreshToken } = await this.generateUserTokens(
        newUser.id,
      );
      return { ...result, accessToken, refreshToken };
    } catch (error: unknown) {
      if (error instanceof BadRequestException) throw error;
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Unknown error occurred during sign up');
    }
  }

  async signIn(body: SigninDto) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email: body.email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(
        body.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }
      // ! remove password from user object before returning
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      const { accessToken, refreshToken } = await this.generateUserTokens(
        user.id,
      );
      return { ...result, accessToken, refreshToken };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new UnauthorizedException(error.message);
      }
      throw new UnauthorizedException('Unknown error occurred during sign in');
    }
  }
  // check me
  async me(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async generateUserTokens(userId: number) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '10h' });
    const refreshToken = uuid();

    await this.storeRefreshToken(refreshToken, userId);
    return {
      accessToken,
      refreshToken,
    };
  }
  async refreshTokens(refreshToken: string) {
    const token = await this.prismaService.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    // check expiry data
    if (token && token.expiresAt < new Date()) {
      await this.prismaService.refreshToken.delete({
        where: { token: refreshToken },
      });
      throw new UnauthorizedException('Refresh Token has expired');
    }

    if (!token) {
      throw new UnauthorizedException('Refresh Token is invalid');
    }
    console.log(this.generateUserTokens(token.userId));
    return this.generateUserTokens(token.userId);
  }

  async storeRefreshToken(token: string, userId: number) {
    // Calculate expiry date 3 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    await this.prismaService.refreshToken.upsert({
      where: { userId: userId }, // assumes userId is unique in the refreshToken table
      update: {
        token,
        expiresAt: expiryDate,
      },
      create: {
        token,
        userId: Number(userId),
        expiresAt: expiryDate,
      },
    });
  }
}
