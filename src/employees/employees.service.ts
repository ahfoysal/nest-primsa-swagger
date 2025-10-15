import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/employees.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const newUser = await this.prismaService.employee.create({
      data: createEmployeeDto,
    });
    // failed to create user
    if (!newUser) {
      throw new NotFoundException('Failed to create user');
    }
    return newUser;
  }

  async findAll(role?: 'ADMIN' | 'USER' | 'GUEST') {
    const where = role ? { role } : {};
    const users = await this.prismaService.employee.findMany({ where });
    if (!users) {
      throw new NotFoundException('No employees found');
    }
    return users;
  }

  async findOne(id: number) {
    const user = await this.prismaService.employee.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateEmployeeDto: Prisma.EmployeeUpdateInput) {
    const updatedUser = await this.prismaService.employee.update({
      where: { id },
      data: updateEmployeeDto,
    });

    if (!updatedUser) {
      throw new NotFoundException(`Failed to update employee with ID ${id}`);
    }
    return updatedUser;
  }

  async remove(id: number) {
    const deletedUser = await this.prismaService.employee.delete({
      where: { id },
    });

    if (!deletedUser) {
      throw new NotFoundException(`Failed to delete employee with ID ${id}`);
    }
    return deletedUser;
  }
}
