import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;

  const authServiceMock = {
    signUp: jest.fn(),
    signIn: jest.fn(),
    verifyAccessToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('signUp', () => {
    it('should signup when given email and password', () => {
      const signUpDto = { email: 'dlqud19@gmail.com', password: '1234' };
      authController.signUp(signUpDto);

      expect(authServiceMock.signUp).toHaveBeenCalledWith(
        signUpDto.email,
        signUpDto.password,
      );
    });
  });

  describe('signIn', () => {
    it('should signIn when given email and password', () => {
      const signInDto = { email: 'dlqud19@gmail.com', password: '1234' };
      authController.signIn(signInDto);

      expect(authServiceMock.signIn).toHaveBeenCalledWith(
        signInDto.email,
        signInDto.password,
      );
    });
  });

  describe('recycleAccessToken', () => {
    it('should recycleAccessToken when given email and password', () => {
      const accessToken = 'accessToken';
      const headers = { authorization: `Bearer ${accessToken}` };

      authController.recycleAccessToken(headers);

      expect(authServiceMock.verifyAccessToken).toHaveBeenCalledWith(
        headers['authorization'],
      );
    });

    it('should throw UnA', () => {
      const accessToken = 'accessToken';
      const headers = { authorization: `Bearer ${accessToken}` };

      authServiceMock.verifyAccessToken.mockRejectedValueOnce(
        new UnauthorizedException('invalid access token'),
      );

      expect(authController.recycleAccessToken(headers)).rejects.toThrow(
        new UnauthorizedException('invalid access token'),
      );
    });
  });
});
