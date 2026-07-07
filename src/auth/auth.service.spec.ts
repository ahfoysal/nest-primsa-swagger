import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService.refreshTokens', () => {
  const prismaService = {
    refreshToken: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  const jwtService = {
    sign: jest.fn(),
  } as unknown as JwtService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates a single token pair for a valid refresh token', async () => {
    prismaService.refreshToken.findUnique.mockResolvedValue({
      token: 'refresh-token',
      userId: 42,
      expiresAt: new Date(Date.now() + 60_000),
    });

    const service = new AuthService(prismaService as any, jwtService);
    const generateUserTokens = jest
      .spyOn(service, 'generateUserTokens')
      .mockResolvedValue({ accessToken: 'access', refreshToken: 'next-refresh' });

    await expect(service.refreshTokens('refresh-token')).resolves.toEqual({
      accessToken: 'access',
      refreshToken: 'next-refresh',
    });
    expect(generateUserTokens).toHaveBeenCalledTimes(1);
    expect(generateUserTokens).toHaveBeenCalledWith(42);
  });

  it('rejects invalid refresh tokens', async () => {
    prismaService.refreshToken.findUnique.mockResolvedValue(null);

    const service = new AuthService(prismaService as any, jwtService);

    await expect(service.refreshTokens('missing')).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
