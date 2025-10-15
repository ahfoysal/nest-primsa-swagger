import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Prisma } from 'generated/prisma';

export class CreateEmployeeDto implements Prisma.EmployeeCreateInput {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the employee',
  })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'john@gmail.com',
    description: 'Email of the employee',
    required: false,
  })
  email: string;

  @IsNotEmpty()
  @IsEnum(['ADMIN', 'USER', 'GUEST'])
  @ApiProperty({ example: 'ADMIN', description: 'Role of the employee' })
  role: 'ADMIN' | 'USER' | 'GUEST';
}

//  updateEmployeeDto and swagger schema api  properties with partial type
export class UpdateEmployeeDto
  extends PartialType(CreateEmployeeDto)
  implements Prisma.EmployeeUpdateInput {}
