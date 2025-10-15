import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  private users = [
    { id: 1, name: 'John Doe', role: 'admin', email: 'xyz@xyz.com' },
    { id: 2, name: 'Jane Doe', role: 'user', email: 'xyz@xyz.com' },
    { id: 3, name: 'Bob Smith', role: 'admin', email: 'xyz@xyz.com' },
    { id: 4, name: 'Alice Johnson', role: 'user', email: 'xyz@xyz.com' },
    { id: 5, name: 'Tom Wilson', role: 'admin', email: 'xyz@xyz.com' },
    { id: 6, name: 'Sara Lee', role: 'user', email: 'xyz@xyz.com' },
    { id: 7, name: 'Mike Brown', role: 'admin', email: 'xyz@xyz.com' },
  ];

  findAll(role?: string, name?: string) {
    let filteredUsers = this.users;
    if (role) {
      filteredUsers = filteredUsers.filter((user) => user.role === role);
      if (filteredUsers.length === 0) {
        throw new NotFoundException('No users found with the specified role');
      }
    }
    if (name) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(name.toLowerCase()),
      );
    }
    return filteredUsers;
  }
  findOne(id: number) {
    const user = this.users.find((user) => user.id === id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  create(user: { name: string; role: string; email: string }) {
    const userHighestId = this.users.reduce(
      (maxId, user) => Math.max(maxId, user.id),
      0,
    );
    const newUser = { id: userHighestId + 1, ...user };
    this.users.push(newUser);
    return newUser;
  }
  update(id: number, user: UpdateUserDto) {
    const existingUser = this.users.find((u) => u.id === id);
    if (existingUser) {
      Object.assign(existingUser, user);
    }
    return existingUser;
  }
  delete(id: number) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      const deletedUser = this.users.splice(index, 1);
      return deletedUser[0];
    }
    return null;
  }
}
