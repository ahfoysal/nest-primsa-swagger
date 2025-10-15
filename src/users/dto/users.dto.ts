import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEnum(['ADMIN', 'USER', 'GUEST'])
  role: string;
  @IsEmail()
  email: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class User {
  @IsNotEmpty()
  id: number;
  @IsString()
  name: string;
  @IsString()
  role: string;
  @IsEmail()
  email: string;
}
