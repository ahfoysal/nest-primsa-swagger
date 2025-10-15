// SignUpDto with class validator and swagger

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

//   id        Int      @id @default(autoincrement())
//   name      String
//   email     String   @unique
//   password  String
//   role      Role

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'john@gmail.com',
    description: 'Email of the user',
    required: false,
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'password',
    description: 'Password of the user',
  })
  password: string;
  @IsNotEmpty()
  @IsEnum(['ADMIN', 'USER', 'GUEST'])
  @ApiProperty({ example: 'ADMIN', description: 'Role of the user' })
  role: 'ADMIN' | 'USER' | 'GUEST';
}

// LoginDto  email and password
export class SigninDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'john@gmail.com',
    description: 'Email of the user',
  })
  email: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'password',
    description: 'Password of the user',
  })
  password: string;
}

//  me dto
